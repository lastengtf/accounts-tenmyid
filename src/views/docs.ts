import { layout, escapeHtml } from './layout';

export interface DocsViewProps {
  user?: {
    name: string;
    email: string;
    role?: string | null;
  } | null;
}

export function docsView({ user }: DocsViewProps = {}): string {
  const content = `
    <div class="w-full max-w-4xl mx-auto space-y-8">
      
      <!-- Docs Hero Header -->
      <div class="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Dokumentasi Integrasi SSO
              </h1>
              <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full font-mono font-bold">OIDC 1.0</span>
            </div>
            <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed max-w-2xl">
              Panduan integrasi standar industri untuk menghubungkan aplikasi satelit di ekosistem <code class="font-mono text-xs">*.ten.my.id</code> menggunakan Single Sign-On (SSO) OAuth 2.1 & OpenID Connect.
            </p>
          </div>

          <!-- AI Agent Quick Badges -->
          <div class="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
            <a 
              href="/llms.txt" 
              target="_blank" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>llms.txt (Untuk AI Agent)</span>
            </a>
            <a 
              href="/api/docs/ai" 
              target="_blank" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <span class="font-mono text-[11px]">{ }</span>
              <span>JSON Spec (API)</span>
            </a>
          </div>
        </div>
      </div>

      <!-- AI Agent Integration Notice Card -->
      <div class="bg-gradient-to-r from-indigo-50/80 via-white to-zinc-50 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900/60 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm mt-0.5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Khusus AI Coding Agent (Cursor, Claude, Copilot, Antigravity)</h2>
              <span class="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.2 rounded-full uppercase">Standard 2026</span>
            </div>
            <p class="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Jika Anda sedang mengembangkan aplikasi satelit dengan bantuan AI Agent, Anda cukup memberikan URL berikut sebagai konteks atau knowledge base prompt:
            </p>
            <div class="flex items-center gap-2 pt-1">
              <code class="font-mono bg-white dark:bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-indigo-600 dark:text-indigo-400 select-all">
                https://accounts.ten.my.id/llms.txt
              </code>
              <button data-copy="https://accounts.ten.my.id/llms.txt" class="copy-btn text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
                Salin URL
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quickstart Stepper -->
      <div class="space-y-4">
        <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          3 Langkah Cepat Integrasi
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-2">
            <div class="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Daftarkan Klien</h3>
            <p class="text-zinc-500 leading-relaxed">
              Buka menu <a href="/admin/clients" class="text-indigo-600 dark:text-indigo-400 underline font-medium">Aplikasi Satelit</a> di Konsol Admin, lalu klik <strong>+ Daftarkan Klien Baru</strong>.
            </p>
          </div>

          <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-2">
            <div class="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Atur Redirect URI</h3>
            <p class="text-zinc-500 leading-relaxed">
              Masukkan URL callback aplikasi Anda, misalnya <code class="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">https://app.ten.my.id/api/auth/callback</code>.
            </p>
          </div>

          <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-2">
            <div class="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Pasang Kode OIDC</h3>
            <p class="text-zinc-500 leading-relaxed">
              Gunakan Client ID & Secret pada pustaka autentikasi favorit Anda (NextAuth, Hono, Better-Auth, dll).
            </p>
          </div>
        </div>
      </div>

      <!-- Core Endpoints Table -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Daftar Endpoint OIDC & OAuth 2.1
          </h2>
          <span class="text-xs text-zinc-400 font-mono">accounts.ten.my.id</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono">
            <thead>
              <tr class="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                <th class="pb-2.5">Fungsi</th>
                <th class="pb-2.5">Method</th>
                <th class="pb-2.5">Endpoint URL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
              <tr>
                <td class="py-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">OIDC Discovery</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">GET</span></td>
                <td class="py-3 text-indigo-600 dark:text-indigo-400 font-medium select-all">/.well-known/openid-configuration</td>
              </tr>
              <tr>
                <td class="py-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Authorization (Login SSO)</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">GET</span></td>
                <td class="py-3 text-indigo-600 dark:text-indigo-400 font-medium select-all">/api/auth/oauth2/authorize</td>
              </tr>
              <tr>
                <td class="py-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Token Exchange</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold">POST</span></td>
                <td class="py-3 text-indigo-600 dark:text-indigo-400 font-medium select-all">/api/auth/oauth2/token</td>
              </tr>
              <tr>
                <td class="py-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">UserInfo (Profil)</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">GET</span></td>
                <td class="py-3 text-indigo-600 dark:text-indigo-400 font-medium select-all">/api/auth/oauth2/userinfo</td>
              </tr>
              <tr>
                <td class="py-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Public Keys (JWKS)</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">GET</span></td>
                <td class="py-3 text-indigo-600 dark:text-indigo-400 font-medium select-all">/api/auth/jwks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Code Snippets by Framework -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Contoh Kode Integrasi Satelit
        </h2>

        <!-- Framework Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800 text-xs">
          <button data-tab-target="tab-nextjs" class="fw-tab-btn py-1.5 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold transition">
            Next.js (Auth.js)
          </button>
          <button data-tab-target="tab-hono" class="fw-tab-btn py-1.5 px-3 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition">
            Hono / Cloudflare
          </button>
          <button data-tab-target="tab-betterauth" class="fw-tab-btn py-1.5 px-3 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition">
            Better-Auth Client
          </button>
          <button data-tab-target="tab-python" class="fw-tab-btn py-1.5 px-3 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition">
            Python (FastAPI)
          </button>
        </div>

        <!-- Next.js Tab -->
        <div id="tab-nextjs" class="fw-tab-content space-y-3">
          <div class="flex items-center justify-between text-xs text-zinc-500">
            <span>Install: <code class="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">npm install next-auth@beta</code></span>
            <button data-copy-target="code-nextjs" class="copy-code-btn text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Salin Kode</button>
          </div>
          <pre id="code-nextjs" class="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "ten-accounts",
      name: "TEN Accounts",
      type: "oidc",
      issuer: "https://accounts.ten.my.id",
      clientId: process.env.TEN_CLIENT_ID,         // misal: "schedule-app"
      clientSecret: process.env.TEN_CLIENT_SECRET, // Secret dari /admin/clients
    },
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.role = profile.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  }
});</pre>
        </div>

        <!-- Hono Tab -->
        <div id="tab-hono" class="fw-tab-content hidden space-y-3">
          <div class="flex items-center justify-between text-xs text-zinc-500">
            <span>Universal Native Fetch di Cloudflare Workers / Node.js</span>
            <button data-copy-target="code-hono" class="copy-code-btn text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Salin Kode</button>
          </div>
          <pre id="code-hono" class="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">import { Hono } from 'hono';

const app = new Hono();

// 1. Rute Inisiasi Login SSO
app.get('/login', (c) => {
  const authUrl = new URL('https://accounts.ten.my.id/api/auth/oauth2/authorize');
  authUrl.searchParams.set('client_id', 'schedule-app');
  authUrl.searchParams.set('redirect_uri', 'https://satelit.ten.my.id/api/auth/callback');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', crypto.randomUUID());

  return c.redirect(authUrl.toString());
});

// 2. Rute Callback OIDC
app.get('/api/auth/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.text('Otorisasi dibatalkan', 400);

  // Tukar Authorization Code dengan Token
  const tokenRes = await fetch('https://accounts.ten.my.id/api/auth/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://satelit.ten.my.id/api/auth/callback',
      client_id: 'schedule-app',
      client_secret: 'sec_xxxxxxxxxxxxxxxxxxxxxxxx',
    }),
  });

  const tokens = await tokenRes.json();

  // Ambil Data Profil Pengguna
  const userRes = await fetch('https://accounts.ten.my.id/api/auth/oauth2/userinfo', {
    headers: { Authorization: \`Bearer \${tokens.access_token}\` },
  });
  const user = await userRes.json();

  return c.json({ loggedIn: true, user });
});</pre>
        </div>

        <!-- Better Auth Tab -->
        <div id="tab-betterauth" class="fw-tab-content hidden space-y-3">
          <div class="flex items-center justify-between text-xs text-zinc-500">
            <span>Install: <code class="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">npm install better-auth</code></span>
            <button data-copy-target="code-betterauth" class="copy-code-btn text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Salin Kode</button>
          </div>
          <pre id="code-betterauth" class="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "https://accounts.ten.my.id",
});

// Di tombol login aplikasi satelit:
await authClient.signIn.oauth2({
  providerId: "ten-accounts",
  callbackURL: "/dashboard",
});</pre>
        </div>

        <!-- Python Tab -->
        <div id="tab-python" class="fw-tab-content hidden space-y-3">
          <div class="flex items-center justify-between text-xs text-zinc-500">
            <span>Install: <code class="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">pip install authlib httpx fastapi</code></span>
            <button data-copy-target="code-python" class="copy-code-btn text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Salin Kode</button>
          </div>
          <pre id="code-python" class="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">from fastapi import FastAPI, Request
from authlib.integrations.starlette_client import OAuth

app = FastAPI()
oauth = OAuth()

oauth.register(
    name='ten_accounts',
    server_metadata_url='https://accounts.ten.my.id/.well-known/openid-configuration',
    client_id='schedule-app',
    client_secret='sec_xxxxxxxxxxxxxxxxxxxxxxxx',
    client_kwargs={'scope': 'openid profile email'}
)

@app.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.ten_accounts.authorize_redirect(request, redirect_uri)

@app.get('/api/auth/callback')
async def auth_callback(request: Request):
    token = await oauth.ten_accounts.authorize_access_token(request)
    user = token.get('userinfo')
    return {"user": user}</pre>
        </div>

      </div>

    </div>
  `;

  const scripts = `
    <script>
      // Tab switcher
      const tabButtons = document.querySelectorAll('.fw-tab-btn');
      const tabContents = document.querySelectorAll('.fw-tab-content');

      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab-target');
          
          tabButtons.forEach(b => {
            b.className = 'fw-tab-btn py-1.5 px-3 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition';
          });
          btn.className = 'fw-tab-btn py-1.5 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold transition';

          tabContents.forEach(c => c.classList.add('hidden'));
          document.getElementById(targetId)?.classList.remove('hidden');
        });
      });

      // Copy text button
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const text = btn.getAttribute('data-copy');
          if (!text) return;
          try {
            await navigator.clipboard.writeText(text);
            const originalText = btn.textContent;
            btn.textContent = 'Tersalin!';
            setTimeout(() => { btn.textContent = originalText; }, 1500);
          } catch (e) {
            console.error(e);
          }
        });
      });

      // Copy code snippet button
      document.querySelectorAll('.copy-code-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const targetId = btn.getAttribute('data-copy-target');
          const codeEl = document.getElementById(targetId);
          if (!codeEl) return;
          try {
            await navigator.clipboard.writeText(codeEl.textContent || '');
            const originalText = btn.textContent;
            btn.textContent = 'Tersalin!';
            setTimeout(() => { btn.textContent = originalText; }, 1500);
          } catch (e) {
            console.error(e);
          }
        });
      });
    </script>
  `;

  return layout({ title: 'Dokumentasi Integrasi SSO & AI Agent', user, content, scripts });
}
