import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { getAuth } from './auth';
import type { Env, User, Session } from './types';

// Auth Gateway Views
import { loginView } from './views/login';
import { registerView } from './views/register';
import { consentView } from './views/consent';

// Account Hub Views
import { accountProfileView } from './views/account/profile';
import { accountSecurityView } from './views/account/security';
import { accountAppsView } from './views/account/apps';

// Admin IAM Views
import { adminDashboardView } from './views/admin/dashboard';
import { adminClientsView } from './views/admin/clients';
import { adminUsersView } from './views/admin/users';

// Documentation & AI Agent Views
import { docsView } from './views/docs';
import { LLMS_TXT_CONTENT, IDP_METADATA } from './docs-data';

const app = new Hono<{
  Bindings: Env;
  Variables: {
    session?: { user: User; session: Session };
    adminSession?: { user: User; session: Session };
  };
}>();

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
async function getSession(c: any): Promise<{ user: User; session: Session } | null> {
  try {
    const auth = getAuth(c.env, c.req.raw);
    const res = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!res || !res.user) return null;
    return res as any;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

// -------------------------------------------------------------
// Security & RBAC Guards
// -------------------------------------------------------------

// Require Authentication (For /account/*)
async function requireAuth(c: any, next: any) {
  const session = await getSession(c);
  if (!session?.user) {
    const isApi = c.req.path.startsWith('/api/');
    if (isApi) {
      return c.json({ error: 'Unauthorized: Harap masuk terlebih dahulu' }, 401);
    }
    const currentUrl = c.req.url;
    return c.redirect(`/login?redirect=${encodeURIComponent(currentUrl)}`);
  }
  c.set('session', session);
  return next();
}

// Require Administrator Role (For /admin/* and /api/admin/*)
async function requireAdmin(c: any, next: any) {
  const session = await getSession(c);
  const isApi = c.req.path.startsWith('/api/');

  if (!session?.user) {
    if (isApi) {
      return c.json({ error: 'Unauthorized: Harap masuk terlebih dahulu' }, 401);
    }
    const currentUrl = c.req.url;
    return c.redirect(`/login?redirect=${encodeURIComponent(currentUrl)}`);
  }

  // Check admin role
  if (session.user.role !== 'admin') {
    if (isApi) {
      return c.json({ error: 'Forbidden: Hak akses Administrator diperlukan' }, 403);
    }
    return c.html(`
      <!DOCTYPE html>
      <html lang="id" class="h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Akses Ditolak | TEN Accounts</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center shadow-sm">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center font-bold text-lg mb-4">403</div>
          <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Akses Terbatas</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            Halaman ini hanya dapat diakses oleh Administrator ekosistem TEN. Akun Anda (<span class="font-mono text-zinc-700 dark:text-zinc-300">${session.user.email}</span>) tidak memiliki izin role administrator.
          </p>
          <a href="/account" class="inline-block px-4 py-2 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
            Kembali ke Akun Saya
          </a>
        </div>
      </body>
      </html>
    `, 403);
  }

  c.set('adminSession', session);
  return next();
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
// Specific override: Revoke all other device sessions
app.post('/api/auth/revoke-other-sessions', async (c) => {
  const session = await getSession(c);
  if (!session?.user || !session?.session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    await c.env.DB.prepare(
      'DELETE FROM session WHERE userId = ? AND id != ?'
    ).bind(session.user.id, session.session.id).run();

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message || 'Gagal mencabut sesi lain' }, 500);
  }
});

// Specific override: Revoke OAuth Consent
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
    return c.json({ error: err.message || 'Gagal mencabut izin aplikasi' }, 500);
  }
});

// Standard Better Auth handler for everything else under /api/auth/*
app.on(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], '/api/auth/*', async (c) => {
  const auth = getAuth(c.env, c.req.raw);
  return auth.handler(c.req.raw);
});

// -------------------------------------------------------------
// Zone 1: Public & Auth Gateway Pages
// -------------------------------------------------------------

// Root redirect
app.get('/', async (c) => {
  const session = await getSession(c);
  if (session?.user) {
    return c.redirect('/account');
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
    return c.redirect('/account');
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
    return c.redirect('/account');
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

// -------------------------------------------------------------
// Developer & AI Agent Knowledge Hub
// -------------------------------------------------------------

// Interactive Documentation Page
app.get('/docs', async (c) => {
  const session = await getSession(c);
  return c.html(docsView({ user: session?.user }));
});

// Emerging Standard for LLM / AI Coding Agents (llms.txt)
const handleLlmsTxt = (c: any) => {
  return c.text(LLMS_TXT_CONTENT, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });
};
app.get('/llms.txt', handleLlmsTxt);
app.get('/llms-full.txt', handleLlmsTxt);
app.get('/.well-known/llms.txt', handleLlmsTxt);

// Machine-readable AI Agent API Specification (JSON)
app.get('/api/docs/ai', (c) => {
  return c.json({
    status: 'success',
    idp: IDP_METADATA,
    llms_txt_url: 'https://accounts.ten.my.id/llms.txt',
    integration_guide_summary: 'To integrate any satellite app (*.ten.my.id or localhost), register a client in /admin/clients, configure the redirect URI, and use the OIDC Authorization Code Flow with PKCE. Tokens can be validated against the JWKS endpoint.',
  });
});

// Legacy URL backwards compatibility
app.get('/profile', (c) => c.redirect('/account/profile'));
app.get('/developers', (c) => c.redirect('/admin/clients'));

// -------------------------------------------------------------
// Zone 2: My Account Hub (/account/*) - Self-service for all users
// -------------------------------------------------------------

app.use('/account', requireAuth);
app.use('/account/*', requireAuth);

// Account root redirect
app.get('/account', (c) => c.redirect('/account/profile'));

// 1. Account Profile Page
app.get('/account/profile', async (c) => {
  const session = c.get('session')!;
  return c.html(accountProfileView({ user: session.user }));
});

// 2. Account Security & Active Sessions Page
app.get('/account/security', async (c) => {
  const session = c.get('session')!;

  let sessions: Session[] = [];
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, 
        userId, 
        token, 
        expiresAt, 
        ipAddress, 
        userAgent, 
        createdAt, 
        updatedAt 
      FROM session 
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `).bind(session.user.id).all<any>();

    if (results) {
      sessions = results;
    }
  } catch (err) {
    console.error('Error querying sessions:', err);
  }

  return c.html(
    accountSecurityView({
      user: session.user,
      sessions,
      currentSessionToken: session.session?.token || '',
    })
  );
});

// 3. Authorized Satellite Apps Page
app.get('/account/apps', async (c) => {
  const session = c.get('session')!;

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
    accountAppsView({
      user: session.user,
      authorizedApps,
    })
  );
});

// -------------------------------------------------------------
// Zone 3: Admin & IAM Console (/admin/* & /api/admin/*) - RBAC Admin only
// -------------------------------------------------------------

app.use('/admin', requireAdmin);
app.use('/admin/*', requireAdmin);
app.use('/api/admin/*', requireAdmin);

// 1. Admin Dashboard / Overview
app.get('/admin', async (c) => {
  const session = c.get('adminSession')!;

  let totalUsers = 0;
  let totalClients = 0;
  let totalSessions = 0;

  try {
    const [uCount, cCount, sCount] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM "user"').first<{ count: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM oauthClient').first<{ count: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM session').first<{ count: number }>(),
    ]);

    totalUsers = uCount?.count || 0;
    totalClients = cCount?.count || 0;
    totalSessions = sCount?.count || 0;
  } catch (err) {
    console.error('Error querying admin metrics:', err);
  }

  return c.html(
    adminDashboardView({
      user: session.user,
      stats: {
        totalUsers,
        totalClients,
        totalSessions,
      },
    })
  );
});

// 2. Admin Satellite Clients Management
app.get('/admin/clients', async (c) => {
  const session = c.get('adminSession')!;

  let clients: any[] = [];
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, 
        clientId, 
        clientSecret, 
        name, 
        redirectUris, 
        scopes, 
        skipConsent, 
        createdAt 
      FROM oauthClient 
      ORDER BY createdAt DESC
    `).all<any>();

    if (results) {
      clients = results;
    }
  } catch (err) {
    console.error('Error querying oauth clients:', err);
  }

  return c.html(
    adminClientsView({
      user: session.user,
      clients,
    })
  );
});

// 3. Admin Users Directory
app.get('/admin/users', async (c) => {
  const session = c.get('adminSession')!;

  let users: any[] = [];
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, 
        name, 
        email, 
        emailVerified, 
        role, 
        createdAt 
      FROM "user" 
      ORDER BY createdAt DESC
    `).all<any>();

    if (results) {
      users = results;
    }
  } catch (err) {
    console.error('Error querying users:', err);
  }

  return c.html(
    adminUsersView({
      user: session.user,
      users,
    })
  );
});

// -------------------------------------------------------------
// Admin API Endpoints
// -------------------------------------------------------------

// Admin API: Create Satellite OAuth Client
const handleCreateClient = async (c: any) => {
  try {
    const body = (await c.req.json()) as {
      name: string;
      clientId?: string;
      redirectUris: string[];
      skipConsent?: boolean;
    };

    if (!body.name || !body.redirectUris || body.redirectUris.length === 0) {
      return c.json({ error: 'Nama aplikasi dan minimal satu Redirect URI wajib diisi.' }, 400);
    }

    const clientId = body.clientId
      ? body.clientId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
      : (body.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + crypto.randomUUID().slice(0, 6));

    // Generate secure random client secret
    const rawSecret = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const clientSecret = 'sec_' + rawSecret.slice(0, 40);
    const id = 'client_' + crypto.randomUUID().slice(0, 12);
    const redirectUrisJson = JSON.stringify(body.redirectUris);
    const now = Date.now();

    await c.env.DB.prepare(`
      INSERT INTO oauthClient (
        id,
        clientId,
        clientSecret,
        name,
        redirectUris,
        scopes,
        skipConsent,
        tokenEndpointAuthMethod,
        grantTypes,
        responseTypes,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      clientId,
      clientSecret,
      body.name.trim(),
      redirectUrisJson,
      'openid profile email',
      body.skipConsent ? 1 : 0,
      'client_secret_post',
      'authorization_code,refresh_token',
      'code',
      now,
      now
    ).run();

    return c.json({
      success: true,
      clientId,
      clientSecret,
      name: body.name
    });
  } catch (err: any) {
    console.error('Error creating oauth client:', err);
    return c.json({ error: err.message || 'Gagal mendaftarkan klien' }, 500);
  }
};

app.post('/api/admin/clients', handleCreateClient);
app.post('/api/developers/clients', handleCreateClient); // Legacy compatibility

// Admin API: Rotate Satellite Client Secret
const handleRotateSecret = async (c: any) => {
  const clientId = c.req.param('id');
  try {
    const rawSecret = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const newSecret = 'sec_' + rawSecret.slice(0, 40);
    const now = Date.now();

    await c.env.DB.prepare(
      'UPDATE oauthClient SET clientSecret = ?, updatedAt = ? WHERE id = ?'
    ).bind(newSecret, now, clientId).run();

    return c.json({ success: true, newSecret });
  } catch (err: any) {
    return c.json({ error: err.message || 'Gagal memutar secret' }, 500);
  }
};

app.post('/api/admin/clients/:id/rotate', handleRotateSecret);
app.post('/api/developers/clients/:id/rotate', handleRotateSecret); // Legacy compatibility

// Admin API: Delete Satellite Client
const handleDeleteClient = async (c: any) => {
  const clientId = c.req.param('id');
  try {
    await c.env.DB.prepare('DELETE FROM oauthClient WHERE id = ?').bind(clientId).run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message || 'Gagal menghapus klien' }, 500);
  }
};

app.delete('/api/admin/clients/:id', handleDeleteClient);
app.delete('/api/developers/clients/:id', handleDeleteClient); // Legacy compatibility

// Admin API: Change User Role (RBAC)
app.post('/api/admin/users/:id/role', async (c) => {
  const session = c.get('adminSession')!;
  const targetUserId = c.req.param('id');

  try {
    const body = (await c.req.json()) as { role: string };

    if (!body.role || !['user', 'admin'].includes(body.role)) {
      return c.json({ error: 'Role tidak valid. Gunakan "user" atau "admin".' }, 400);
    }

    // Safety guard: Admin cannot demote themselves
    if (targetUserId === session.user.id && body.role !== 'admin') {
      return c.json({ error: 'Anda tidak dapat mencabut status administrator dari akun Anda sendiri.' }, 400);
    }

    const now = Date.now();
    await c.env.DB.prepare(
      'UPDATE "user" SET role = ?, updatedAt = ? WHERE id = ?'
    ).bind(body.role, now, targetUserId).run();

    return c.json({ success: true, role: body.role });
  } catch (err: any) {
    console.error('Error changing user role:', err);
    return c.json({ error: err.message || 'Gagal memperbarui role pengguna' }, 500);
  }
});

export default app;
