import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins/jwt';
import { oauthProvider } from '@better-auth/oauth-provider';
import { admin } from 'better-auth/plugins/admin';
import type { Env } from './types';

/**
 * Creates and returns a Better Auth instance configured for Cloudflare Workers and D1.
 * Equipped with OAuth 2.1 Provider, JWT signing, and RBAC Admin plugin.
 * 
 * @param env Cloudflare Worker environment bindings
 * @param request Optional incoming HTTP request for dynamic cookie domain & origin handling
 */
export function getAuth(env: Env, request?: Request) {
  // Determine if running on localhost for seamless local development
  let isLocal = false;
  if (request) {
    try {
      const url = new URL(request.url);
      isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    } catch {
      isLocal = false;
    }
  }

  const baseUrl = env.BETTER_AUTH_URL || (isLocal ? 'http://localhost:8787' : 'https://accounts.ten.my.id');

  return betterAuth({
    database: env.DB,
    baseURL: baseUrl,
    secret: env.BETTER_AUTH_SECRET || 'dev-fallback-secret-ten-accounts-32chars-min',
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    advanced: {
      cookiePrefix: 'accounts_sso',
      defaultCookieAttributes: {
        domain: isLocal ? undefined : '.ten.my.id',
        secure: !isLocal,
        sameSite: 'lax',
        httpOnly: true,
      },
    },
    plugins: [
      jwt(),
      oauthProvider({
        loginPage: '/login',
        consentPage: '/consent',
        allowPublicClientPrelogin: true,
      }),
      admin({
        defaultRole: 'user',
      }),
    ],
  });
}

export type Auth = ReturnType<typeof getAuth>;
