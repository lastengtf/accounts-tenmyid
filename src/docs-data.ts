/**
 * Knowledge Base & Integration Reference for TEN Accounts (Identity Provider)
 * Optimized for Human Developers & AI Coding Agents (LLMs).
 */

export const IDP_METADATA = {
  name: "TEN Accounts",
  issuer: "https://accounts.ten.my.id",
  protocol: "OAuth 2.1 / OpenID Connect Core 1.0",
  version: "1.0.0",
  cookieDomain: ".ten.my.id",
  endpoints: {
    discovery: "https://accounts.ten.my.id/.well-known/openid-configuration",
    jwks: "https://accounts.ten.my.id/api/auth/jwks",
    authorization: "https://accounts.ten.my.id/api/auth/oauth2/authorize",
    token: "https://accounts.ten.my.id/api/auth/oauth2/token",
    userinfo: "https://accounts.ten.my.id/api/auth/oauth2/userinfo",
    revocation: "https://accounts.ten.my.id/api/auth/oauth2/revoke",
    registerClient: "https://accounts.ten.my.id/api/auth/oauth2/register",
  },
  supportedScopes: ["openid", "profile", "email"],
  supportedResponseTypes: ["code"],
  supportedGrantTypes: ["authorization_code", "refresh_token"],
  supportedAuthMethods: ["client_secret_post", "client_secret_basic"],
  tokenSigningAlgValues: ["RS256", "EdDSA"],
};

export const LLMS_TXT_CONTENT = `# TEN Accounts Identity Provider (IdP) - llms.txt
> Centralized SSO & IAM service for the TEN ecosystem (*.ten.my.id).

## Overview
TEN Accounts is an OpenID Connect (OIDC) and OAuth 2.1 compliant Identity Provider running on Cloudflare Workers and Cloudflare D1 with Better Auth.
Any satellite application in the TEN ecosystem (e.g., *.ten.my.id or localhost in development) can authenticate users using standard OAuth 2.1 Authorization Code Flow with PKCE.

## Essential Endpoints
- Issuer: https://accounts.ten.my.id
- OIDC Discovery: https://accounts.ten.my.id/.well-known/openid-configuration
- Authorization Endpoint: https://accounts.ten.my.id/api/auth/oauth2/authorize
- Token Endpoint: https://accounts.ten.my.id/api/auth/oauth2/token
- UserInfo Endpoint: https://accounts.ten.my.id/api/auth/oauth2/userinfo
- JWKS URI: https://accounts.ten.my.id/api/auth/jwks

## Standard OAuth 2.1 Integration Flow
1. Redirect user to Authorization URL:
   GET https://accounts.ten.my.id/api/auth/oauth2/authorize
   Params:
     - client_id: <SATELLITE_CLIENT_ID>
     - redirect_uri: <REGISTERED_CALLBACK_URL>
     - response_type: code
     - scope: openid profile email
     - state: <RANDOM_CSRF_TOKEN>
     - code_challenge: <S256_HASH_OF_VERIFIER> (Optional but recommended)
     - code_challenge_method: S256

2. User authenticates on accounts.ten.my.id (or bypasses if already logged in via shared cookie .ten.my.id).
   If client is flagged as "Skip Consent", user is immediately redirected back without prompt.

3. Exchange Authorization Code for Tokens:
   POST https://accounts.ten.my.id/api/auth/oauth2/token
   Headers: Content-Type: application/x-www-form-urlencoded
   Body:
     - grant_type: authorization_code
     - code: <AUTHORIZATION_CODE>
     - redirect_uri: <REGISTERED_CALLBACK_URL>
     - client_id: <SATELLITE_CLIENT_ID>
     - client_secret: <SATELLITE_CLIENT_SECRET>

4. Response:
   {
     "access_token": "...",
     "id_token": "<JWT_TOKEN>",
     "token_type": "Bearer",
     "expires_in": 3600
   }

5. Fetch User Profile:
   GET https://accounts.ten.my.id/api/auth/oauth2/userinfo
   Headers: Authorization: Bearer <access_token>
   Returns:
   {
     "sub": "user_id_string",
     "name": "User Full Name",
     "email": "user@domain.com",
     "email_verified": true,
     "role": "user" | "admin"
   }

## Framework Integration Examples

### Next.js (Auth.js / NextAuth v5)
\`\`\`typescript
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "ten-accounts",
      name: "TEN Accounts",
      type: "oidc",
      issuer: "https://accounts.ten.my.id",
      clientId: process.env.TEN_CLIENT_ID,
      clientSecret: process.env.TEN_CLIENT_SECRET,
    },
  ],
});
\`\`\`

### Hono / Cloudflare Workers
\`\`\`typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/login', (c) => {
  const url = new URL('https://accounts.ten.my.id/api/auth/oauth2/authorize');
  url.searchParams.set('client_id', c.env.TEN_CLIENT_ID);
  url.searchParams.set('redirect_uri', 'https://satelit.ten.my.id/api/auth/callback');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', crypto.randomUUID());
  return c.redirect(url.toString());
});

app.get('/api/auth/callback', async (c) => {
  const code = c.req.query('code');
  const tokenRes = await fetch('https://accounts.ten.my.id/api/auth/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code!,
      redirect_uri: 'https://satelit.ten.my.id/api/auth/callback',
      client_id: c.env.TEN_CLIENT_ID,
      client_secret: c.env.TEN_CLIENT_SECRET,
    }),
  });
  const tokens = await tokenRes.json();
  const userRes = await fetch('https://accounts.ten.my.id/api/auth/oauth2/userinfo', {
    headers: { Authorization: \`Bearer \${tokens.access_token}\` },
  });
  const user = await userRes.json();
  return c.json({ loggedIn: true, user });
});
\`\`\`
`;
