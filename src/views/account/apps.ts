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
    <div class="w-full max-w-2xl mx-auto">
      
      <!-- Page Header -->
      <div class="mb-4">
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Aplikasi Terhubung
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Daftar aplikasi di ekosistem TEN yang Anda izinkan mengakses data akun Anda via SSO.
        </p>
      </div>

      ${accountNav('apps')}

      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Aplikasi Diizinkan (${authorizedApps.length})
          </h2>
        </div>

        ${authorizedApps.length > 0 ? `
          <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
            ${authorizedApps.map(app => `
              <div class="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300">
                    ${escapeHtml(app.name.charAt(0).toUpperCase())}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(app.name)}</div>
                    <div class="text-[11px] text-zinc-500">
                      Izin Diberikan: <span class="font-mono bg-zinc-50 dark:bg-zinc-800 px-1 py-0.5 rounded">${escapeHtml(app.scopes)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  data-revoke-id="${escapeHtml(app.id)}"
                  data-app-name="${escapeHtml(app.name)}"
                  class="revoke-btn text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition font-medium"
                >
                  Cabut Izin Akses
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-10 text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            Anda belum memberikan izin akses akun ke aplikasi satelit mana pun.
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

  return layout({ title: 'Aplikasi Terhubung', user, content, scripts });
}
