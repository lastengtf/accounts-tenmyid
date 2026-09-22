-- ============================================================
-- Centralized Identity Provider (SSO / IAM) Schema for Cloudflare D1
-- Better Auth + OAuth 2.1 / OIDC Provider
-- ============================================================

-- Core Better Auth Tables
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,
  "image" TEXT,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" INTEGER NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" INTEGER,
  "refreshTokenExpiresAt" INTEGER,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" INTEGER NOT NULL,
  "createdAt" INTEGER,
  "updatedAt" INTEGER
);

-- JWKS Signing Keys for JWT / OIDC (Better Auth JWT Plugin)
CREATE TABLE IF NOT EXISTS "jwks" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "publicKey" TEXT NOT NULL,
  "privateKey" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL
);

-- ============================================================
-- OAuth 2.1 / OIDC Provider Plugin Tables
-- ============================================================

-- Registered OAuth Clients (Satellite Applications)
CREATE TABLE IF NOT EXISTS "oauthClient" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientId" TEXT NOT NULL UNIQUE,
  "clientSecret" TEXT,
  "name" TEXT NOT NULL,
  "icon" TEXT,
  "metadata" TEXT,
  "redirectUris" TEXT NOT NULL, -- JSON array string, e.g. ["https://jadwal.ten.my.id/api/auth/callback"]
  "scopes" TEXT,                -- Space separated string, e.g. "openid profile email"
  "type" TEXT DEFAULT 'confidential', -- 'public' or 'confidential'
  "disabled" INTEGER DEFAULT 0,
  "userId" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL,
  "skipConsent" INTEGER DEFAULT 0,
  "enableEndSession" INTEGER DEFAULT 0,
  "tokenEndpointAuthMethod" TEXT DEFAULT 'client_secret_basic',
  "grantTypes" TEXT DEFAULT 'authorization_code,refresh_token',
  "responseTypes" TEXT DEFAULT 'code',
  "clientSecretExpiresAt" INTEGER DEFAULT 0
);

-- User Consent Records for Satellite Clients
CREATE TABLE IF NOT EXISTS "oauthConsent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientId" TEXT NOT NULL REFERENCES "oauthClient"("clientId") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "scopes" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "updatedAt" INTEGER NOT NULL,
  "consentGiven" INTEGER NOT NULL DEFAULT 1
);

-- OAuth Refresh Tokens
CREATE TABLE IF NOT EXISTS "oauthRefreshToken" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "token" TEXT NOT NULL UNIQUE,
  "clientId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "sessionId" TEXT REFERENCES "session"("id") ON DELETE CASCADE,
  "scopes" TEXT NOT NULL,
  "expiresAt" INTEGER NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "revokedAt" INTEGER
);

-- OAuth Access Tokens (when not using purely stateless JWT)
CREATE TABLE IF NOT EXISTS "oauthAccessToken" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "token" TEXT NOT NULL UNIQUE,
  "clientId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "sessionId" TEXT REFERENCES "session"("id") ON DELETE CASCADE,
  "scopes" TEXT NOT NULL,
  "expiresAt" INTEGER NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "revokedAt" INTEGER
);

-- OAuth Client Assertion replay prevention
CREATE TABLE IF NOT EXISTS "oauthClientAssertion" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientId" TEXT NOT NULL,
  "jti" TEXT NOT NULL,
  "expiresAt" INTEGER NOT NULL,
  "createdAt" INTEGER NOT NULL
);

-- ============================================================
-- Seed Initial Satellite Client (Schedule App)
-- ============================================================
INSERT OR IGNORE INTO "oauthClient" (
  "id",
  "clientId",
  "clientSecret",
  "name",
  "icon",
  "redirectUris",
  "scopes",
  "type",
  "disabled",
  "skipConsent",
  "enableEndSession",
  "tokenEndpointAuthMethod",
  "grantTypes",
  "responseTypes",
  "createdAt",
  "updatedAt"
) VALUES (
  'client_schedule_app_01',
  'schedule-app',
  'schedule-app-secret-dev-2025',
  'Aplikasi Jadwal TEN',
  'https://accounts.ten.my.id/favicon.ico',
  '["https://jadwal.ten.my.id/api/auth/callback","http://localhost:3000/api/auth/callback"]',
  'openid profile email',
  'confidential',
  0,
  0,
  1,
  'client_secret_post',
  'authorization_code,refresh_token',
  'code',
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000
);
