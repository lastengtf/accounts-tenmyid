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
    <div class="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Konsol IAM & SSO
            </h1>
            <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full font-mono font-bold">RBAC</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pusat kendali autentikasi dan aplikasi satelit ekosistem TEN.
          </p>
        </div>
      </div>

      ${adminNav('dashboard')}

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 shadow-sm">
          <div class="text-xs font-semibold text-zinc-500 mb-1">Total Pengguna Terdaftar</div>
          <div class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">${stats.totalUsers}</div>
          <a href="/admin/users" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block font-medium">
            Direktori pengguna &rarr;
          </a>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 shadow-sm">
          <div class="text-xs font-semibold text-zinc-500 mb-1">Aplikasi Satelit (OAuth)</div>
          <div class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">${stats.totalClients}</div>
          <a href="/admin/clients" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block font-medium">
            Kelola aplikasi &rarr;
          </a>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 shadow-sm">
          <div class="text-xs font-semibold text-zinc-500 mb-1">Sesi Aktif di Edge</div>
          <div class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">${stats.totalSessions}</div>
          <div class="text-[11px] text-zinc-400 mt-2">
            Terdistribusi di Cloudflare Global Network
          </div>
        </div>
      </div>

      <!-- System Architecture & Security Status -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Protokol & Status Infrastruktur
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div class="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>OAuth 2.1 & OpenID Connect</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Aktif</span>
            </div>
            <p class="text-[11px] text-zinc-500">Authorization Code dengan S256 PKCE, ID Token JWT, dan UserInfo API.</p>
          </div>

          <div class="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Client Registration (RFC 7591)</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Tersedia</span>
            </div>
            <p class="text-[11px] text-zinc-500">Registrasi dinamis terstandarisasi di <code>/api/auth/oauth2/register</code>.</p>
          </div>

          <div class="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Cross-Subdomain Cookies</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">.ten.my.id</span>
            </div>
            <p class="text-[11px] text-zinc-500">Cookie sesi terdistribusi secara otomatis untuk semua subdomain <code>*.ten.my.id</code>.</p>
          </div>

          <div class="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Penyimpanan Cloudflare D1</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Tersinkron</span>
            </div>
            <p class="text-[11px] text-zinc-500">Database serverless SQLite ACID-compliant terdistribusi global.</p>
          </div>
        </div>
      </div>

    </div>
  `;

  return layout({ title: 'Ringkasan IAM', user, content, activeNav: 'admin-dashboard' });
}
