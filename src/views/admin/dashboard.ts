import { layout } from '../layout';
import { adminNav } from './nav';
import type { User } from '../../types';

export interface AdminDashboardProps {
  user: User;
  stats: {
    totalUsers: number;
    totalClients: number;
    totalSessions: number;
  };
}

export function adminDashboardView({ user, stats }: AdminDashboardProps): string {
  const content = `
    <div class="w-full max-w-4xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Konsol Manajemen IAM & SSO
            </h1>
            <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded font-mono font-medium">RBAC ADMIN</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Pusat kendali autentikasi, otorisasi, dan aplikasi satelit ekosistem TEN.
          </p>
        </div>
      </div>

      ${adminNav('dashboard')}

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <div class="text-xs font-medium text-zinc-500 mb-1">Total Pengguna Terdaftar</div>
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">${stats.totalUsers}</div>
          <a href="/admin/users" class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
            Lihat direktori pengguna &rarr;
          </a>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <div class="text-xs font-medium text-zinc-500 mb-1">Aplikasi Satelit (OAuth)</div>
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">${stats.totalClients}</div>
          <a href="/admin/clients" class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
            Kelola aplikasi satelit &rarr;
          </a>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <div class="text-xs font-medium text-zinc-500 mb-1">Sesi Aktif di Edge</div>
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">${stats.totalSessions}</div>
          <div class="text-[11px] text-zinc-400 mt-2">
            Terdistribusi di Cloudflare Global Network
          </div>
        </div>
      </div>

      <!-- System Architecture & Security Status -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Status & Protokol Standar
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1.5">
            <div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Protokol OAuth 2.1 & OpenID Connect</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Aktif</span>
            </div>
            <p class="text-[11px] text-zinc-500">Mendukung Authorization Code dengan S256 PKCE, ID Token JWT, dan UserInfo API.</p>
          </div>

          <div class="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1.5">
            <div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Dynamic Client Registration (RFC 7591)</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Tersedia</span>
            </div>
            <p class="text-[11px] text-zinc-500">Endpoint terstandarisasi di <code>/api/auth/oauth2/register</code>.</p>
          </div>

          <div class="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1.5">
            <div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Session Cookies Shared Scope</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">.ten.my.id</span>
            </div>
            <p class="text-[11px] text-zinc-500">Cookie sesi terdistribusi secara otomatis untuk semua subdomain <code>*.ten.my.id</code>.</p>
          </div>

          <div class="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1.5">
            <div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Penyimpanan Terdistribusi Cloudflare D1</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Tersinkronisasi</span>
            </div>
            <p class="text-[11px] text-zinc-500">Database serverless SQLite ACID-compliant dengan replikasi edge instan.</p>
          </div>
        </div>
      </div>

    </div>
  `;

  return layout({ title: 'Konsol Admin', user, content });
}
