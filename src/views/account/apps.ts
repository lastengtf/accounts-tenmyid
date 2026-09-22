import { layout, escapeHtml } from '../layout';
import { accountNav } from './nav';
import type { User } from '../../types';

export interface AccountAppsProps {
  user: User;
  authorizedApps?: Array<{
    id: string;
    clientId: string;
    name: string;
    scopes: string;
    createdAt: number | Date;
  }>;
}

export function accountAppsView({ user, authorizedApps = [] }: AccountAppsProps): string {
  const content = `
    <div class="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      <!-- Page Header -->
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Aplikasi Terhubung
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Daftar aplikasi satelit yang Anda izinkan mengakses data akun SSO Anda.
        </p>
      </div>

      ${accountNav('apps')}

      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Aplikasi Terdaftar (${authorizedApps.length})
          </h2>
        </div>

        ${authorizedApps.length > 0 ? `
          <div class="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            ${authorizedApps.map(app => `
              <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div class="flex items-center gap-3.5">
                  <div class="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300 shadow-sm flex-shrink-0">
                    ${escapeHtml(app.name.charAt(0).toUpperCase())}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(app.name)}</div>
                    <div class="text-[11px] text-zinc-500 mt-0.5">
                      Scope: <code class="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">${escapeHtml(app.scopes)}</code>
                    </div>
                  </div>
                </div>
                
                <div class="pl-14 sm:pl-0">
                  <button 
                    data-revoke-id="${escapeHtml(app.id)}"
                    data-app-name="${escapeHtml(app.name)}"
                    class="revoke-btn w-full sm:w-auto text-xs px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 active:scale-[0.98] transition font-semibold"
                  >
                    Cabut Izin Akses
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-12 text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <svg class="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Belum ada aplikasi yang terhubung ke akun Anda.
          </div>
        `}
      </div>

    </div>
  `;

  const scripts = `
    <script>
      document.querySelectorAll('.revoke-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-revoke-id');
          const name = e.target.getAttribute('data-app-name');
          if (!confirm('Cabut izin akses untuk ' + name + '? Aplikasi tidak akan dapat mengakses profil Anda lagi sampai Anda mengizinkannya kembali.')) return;

          try {
            const res = await fetch('/api/auth/oauth2/consent/' + id, { method: 'DELETE' });
            if (res.ok) {
              window.location.reload();
            } else {
              alert('Gagal mencabut izin akses.');
            }
          } catch {
            alert('Kesalahan jaringan.');
          }
        });
      });
    </script>
  `;

  return layout({ title: 'Aplikasi Terhubung', user, content, scripts, activeNav: 'apps' });
}
