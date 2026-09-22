import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { getAuth } from './auth';
import type { Env } from './types';
import { loginView } from './views/login';
import { registerView } from './views/register';
import { consentView } from './views/consent';
import { profileView } from './views/profile';

const app = new Hono<{ Bindings: Env }>();

// Global Error Handler
app.onError((err, c) => {
  console.error('Worker Error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

// Security Headers (CSP, XSS, Frame options)
app.use('*', secureHeaders());

// CORS Configuration for satellite apps (*.ten.my.id and local development)
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin) return null;
      // Allow all subdomains of ten.my.id and apex domain
      if (/^https:\/\/([a-z0-9-]+\.)*ten\.my\.id(:\d+)?$/.test(origin)) {
        return origin;
      }
      // Allow localhost for development
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return origin;
      }
      return null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    credentials: true,
    maxAge: 86400,
  });

  return corsMiddleware(c, next);
});

// Helper: Get active user session
async function getSession(c: any) {
  try {
    const auth = getAuth(c.env, c.req.raw);
    return await auth.api.getSession({
      headers: c.req.raw.headers,
    });
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

// -------------------------------------------------------------
// Well-Known OpenID Connect & OAuth Discovery Endpoints
// -------------------------------------------------------------
app.on(['GET', 'OPTIONS'], '/.well-known/*', async (c) => {
  const auth = getAuth(c.env, c.req.raw);
  return auth.handler(c.req.raw);
});

// -------------------------------------------------------------
// Better Auth Core Handler (/api/auth/*)
// -------------------------------------------------------------
app.on(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], '/api/auth/*', async (c) => {
  const auth = getAuth(c.env, c.req.raw);
  return auth.handler(c.req.raw);
});

// -------------------------------------------------------------
// Revoke Satellite App Consent
// -------------------------------------------------------------
app.delete('/api/auth/oauth2/consent/:id', async (c) => {
  const session = await getSession(c);
  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const consentId = c.req.param('id');
  try {
    await c.env.DB.prepare(
      'DELETE FROM oauthConsent WHERE id = ? AND userId = ?'
    ).bind(consentId, session.user.id).run();

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to revoke consent' }, 500);
  }
});

// -------------------------------------------------------------
// Frontend Pages: Minimalist Zinc Aesthetic
// -------------------------------------------------------------

// Root redirect
app.get('/', async (c) => {
  const session = await getSession(c);
  if (session?.user) {
    return c.redirect('/profile');
  }
  return c.redirect('/login');
});

// Login Page
app.get('/login', async (c) => {
  const redirectUrl = c.req.query('redirect') || c.req.query('callbackURL') || '';
  const session = await getSession(c);

  if (session?.user) {
    if (redirectUrl) {
      return c.redirect(redirectUrl);
    }
    return c.redirect('/profile');
  }

  return c.html(loginView({ redirectUrl }));
});

// Register Page
app.get('/register', async (c) => {
  const redirectUrl = c.req.query('redirect') || c.req.query('callbackURL') || '';
  const session = await getSession(c);

  if (session?.user) {
    if (redirectUrl) {
      return c.redirect(redirectUrl);
    }
    return c.redirect('/profile');
  }

  return c.html(registerView({ redirectUrl }));
});

// OAuth 2.0 / OIDC Consent Screen
app.get('/consent', async (c) => {
  const clientId = c.req.query('client_id') || '';
  const scopeQuery = c.req.query('scope') || 'openid profile email';
  const scopes = scopeQuery.split(/[\s+,]+/).filter(Boolean);

  const session = await getSession(c);
  if (!session?.user) {
    // Save the entire authorization request URL to redirect back after login
    const currentUrl = c.req.url;
    return c.redirect(`/login?redirect=${encodeURIComponent(currentUrl)}`);
  }

  // Lookup client details from D1 database
  let clientName = clientId;
  try {
    const client = await c.env.DB.prepare(
      'SELECT name FROM oauthClient WHERE clientId = ?'
    ).bind(clientId).first<{ name: string }>();

    if (client?.name) {
      clientName = client.name;
    }
  } catch (err) {
    console.error('Error fetching client details:', err);
  }

  return c.html(
    consentView({
      clientId,
      clientName,
      scopes,
      user: session.user,
    })
  );
});

// User Profile & Authorized Satellite Apps Management Page
app.get('/profile', async (c) => {
  const session = await getSession(c);
  if (!session?.user) {
    return c.redirect('/login');
  }

  // Query authorized satellite apps for this user
  let authorizedApps: Array<{
    id: string;
    clientId: string;
    name: string;
    scopes: string;
    createdAt: number;
  }> = [];

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        oc.id, 
        oc.clientId, 
        COALESCE(c.name, oc.clientId) as name, 
        oc.scopes, 
        oc.createdAt
      FROM oauthConsent oc
      LEFT JOIN oauthClient c ON oc.clientId = c.clientId
      WHERE oc.userId = ?
      ORDER BY oc.createdAt DESC
    `).bind(session.user.id).all<any>();

    if (results) {
      authorizedApps = results;
    }
  } catch (err) {
    console.error('Error querying authorized apps:', err);
  }

  return c.html(
    profileView({
      user: session.user,
      authorizedApps,
    })
  );
});

export default app;
