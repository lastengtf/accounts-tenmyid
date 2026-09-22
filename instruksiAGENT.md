Role: Senior Cloud Architect & Full-Stack Security Engineer.

Objective:
Build a production-ready, open-source Centralized Identity Provider (SSO / IAM) system designed to run on Cloudflare Workers edge runtime with Cloudflare D1 (Serverless SQLite), using Better Auth and Hono.js. This platform will serve as the central authentication and OAuth 2.0 / OIDC provider at `https://accounts.ten.my.id`, allowing satellite apps (e.g., `*.ten.my.id`) to implement Single Sign-On (SSO).

---

### 1. Tech Stack & Environment
- Runtime: Cloudflare Workers (Edge runtime, compatibility_flags: ["nodejs_compat"])
- Framework / API: Hono.js (`hono`)
- Auth Engine: Better Auth (`better-auth`) with `@better-auth/oauth-provider` plugin
- Database: Cloudflare D1 with `@better-auth/d1-adapter`
- Frontend UI: Server-rendered or edge-rendered UI for Login, Register, Profile, and OAuth Consent screen (Tailwind CSS, clean minimal aesthetic inspired by Linear/Vercel, Zinc neutral palette, no neon gradients).
- Tooling: TypeScript, Wrangler CLI, Git.

---

### 2. Functional Requirements

#### A. Core Authentication (Pusat Akun)
- Email & password authentication with secure password hashing.
- Session management using secure, HTTP-only cookies configured for root/subdomain access (`.ten.my.id`).
- Profile management page: view basic profile info, change password, and view authorized third-party/satellite apps.

#### B. OAuth 2.0 / OIDC Provider (SSO Engine)
- Use Better Auth's `oauthProvider` plugin to expose standard OAuth 2.0 endpoints:
  - Authorization Endpoint: `/api/auth/oauth2/authorize`
  - Token Endpoint: `/api/auth/oauth2/token`
  - UserInfo Endpoint: `/api/auth/oauth2/userinfo`
- Implement an **OAuth Consent Screen**:
  - When an authorized satellite app (e.g., `app1.ten.my.id`) initiates an OAuth flow, show a clean consent page detailing the app name and requested scopes (`openid`, `profile`, `email`).
  - Allow the user to "Approve" or "Deny" access.

#### C. Satellite Client Management
- Provide a D1 table or configuration structure to register internal client apps (`client_id`, `client_secret`, and allowed `redirect_uris`).
- Seed an initial client config for testing (e.g., `client_id: "schedule-app"`, `redirect_uri: "https://jadwal.ten.my.id/api/auth/callback"`).

---

### 3. File Structure & Implementation Plan
Generate and configure the following files with complete, working code:

1. `wrangler.json` (or `wrangler.toml`):
   - Configure worker name `accounts-sso`.
   - Setup D1 database binding named `DB`.
   - Setup environment variables: `BETTER_AUTH_URL=https://accounts.ten.my.id` and secret binding `BETTER_AUTH_SECRET`.
   - Include custom domain routing for `accounts.ten.my.id`.

2. `src/auth.ts`:
   - Initialize Better Auth with D1 adapter (`provider: "sqlite"`).
   - Configure `emailAndPassword` and the `oauthProvider` plugin.
   - Setup proper cookie attributes (Domain: `.ten.my.id`, Secure, SameSite: `Lax`).

3. `src/index.ts`:
   - Hono router mounted on Cloudflare Worker.
   - CORS middleware configured to allow origins matching `*.ten.my.id` with credentials enabled.
   - Delegate `/api/auth/*` requests directly to Better Auth handler.
   - Serve static/HTML pages for `/login`, `/register`, `/consent`, and `/profile`.

4. `schema.sql`:
   - Full D1 database schema migration file containing tables required by Better Auth: `user`, `session`, `account`, `verification`, plus OAuth provider tables (`oauth_client`, `oauth_authorization_code`, `oauth_consent`).

5. `.github/workflows/deploy.yml`:
   - GitHub Actions workflow that triggers on push to `main`.
   - Runs TypeScript validation, builds the project, applies any pending D1 migrations via `wrangler d1 execute`, and deploys via `cloudflare/wrangler-action`.

---

### 4. UI/UX Rules for Auth & Consent Pages
- Aesthetic: Monochromatic Zinc palette, crisp 1px borders (`border-zinc-200` / dark: `border-zinc-800`), standard spacing (`p-6`, `gap-4`).
- No heavy drop-shadows, no neon violet/cyan buttons. Use solid dark/light buttons (`bg-zinc-900 text-zinc-50`).
- The login and consent screens must be mobile-friendly and look like a polished enterprise SaaS login page.

---

### Output Expected:
Please scaffold the complete codebase step-by-step:
1. Show the `package.json` with all required dependencies.
2. Provide the configuration files (`wrangler.json`, `tsconfig.json`).
3. Provide the full TypeScript source files (`src/auth.ts`, `src/index.ts`, and template rendering for UI).
4. Provide the exact SQL schema for D1.
5. Provide step-by-step terminal instructions to initialize the D1 database, apply migrations, commit to GitHub, and link GitHub Secrets for Cloudflare deployment.

https://github.com/lastengtf/accounts-tenmyid