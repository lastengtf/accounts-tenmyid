import { layout, escapeHtml } from '../layout';
import { adminNav } from './nav';
import type { User } from '../../types';

export interface AdminUsersProps {
  user: User;
  users: Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: boolean | number;
    role?: string | null;
    createdAt: number | Date;
  }>;
}

export function adminUsersView({ user, users = [] }: AdminUsersProps): string {
  const content = `
    <div class="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Direktori Pengguna
            </h1>
            <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-mono font-bold">RBAC</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Daftar seluruh akun terdaftar dan konfigurasi hak akses role.
          </p>
        </div>
      </div>

      ${adminNav('users')}

      <!-- Users Container Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Pengguna Terdaftar (${users.length})
        </h2>

        <!-- 1. Mobile Native Contact Cards (Visible only on mobile screens) -->
        <div class="block sm:hidden divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          ${users.map(u => {
            const isAdmin = u.role === 'admin';
            const isSelf = u.id === user.id;

            return `
              <div class="py-4 first:pt-0 last:pb-0 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                      ${escapeHtml((u.name || u.email).charAt(0).toUpperCase())}
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>${escapeHtml(u.name)}</span>
                        ${isSelf ? `
                          <span class="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-full font-medium">Anda</span>
                        ` : ''}
                      </div>
                      <div class="text-xs text-zinc-500">${escapeHtml(u.email)}</div>
                    </div>
                  </div>

                  <div>
                    ${isAdmin ? `
                      <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full font-bold">Admin</span>
                    ` : `
                      <span class="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">User</span>
                    `}
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                  <div>Terdaftar: ${new Date(u.createdAt).toLocaleDateString('id-ID')}</div>
                  <div class="font-mono">ID: ${escapeHtml(u.id.slice(0, 10))}...</div>
                </div>

                ${!isSelf ? `
                  <button 
                    data-user-id="${escapeHtml(u.id)}"
                    data-target-role="${isAdmin ? 'user' : 'admin'}"
                    class="toggle-role-btn w-full text-center text-xs py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition font-semibold"
                  >
                    ${isAdmin ? 'Ubah jadi User' : 'Jadikan Admin'}
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- 2. Desktop Responsive Table (Hidden on mobile) -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-medium">
                <th class="pb-3 pl-1">Pengguna</th>
                <th class="pb-3">Email</th>
                <th class="pb-3">Role Akses</th>
                <th class="pb-3">Terdaftar</th>
                <th class="pb-3 text-right pr-1">Aksi Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              ${users.map(u => {
                const isAdmin = u.role === 'admin';
                const isSelf = u.id === user.id;

                return `
                  <tr class="py-3">
                    <td class="py-3.5 pl-1">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          ${escapeHtml((u.name || u.email).charAt(0).toUpperCase())}
                        </div>
                        <div>
                          <div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <span>${escapeHtml(u.name)}</span>
                            ${isSelf ? `
                              <span class="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1 py-0.2 rounded font-medium">Anda</span>
                            ` : ''}
                          </div>
                          <div class="text-[10px] text-zinc-400 font-mono">${escapeHtml(u.id)}</div>
                        </div>
                      </div>
                    </td>

                    <td class="py-3.5 text-zinc-600 dark:text-zinc-400">
                      ${escapeHtml(u.email)}
                    </td>

                    <td class="py-3.5">
                      ${isAdmin ? `
                        <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded font-semibold uppercase">Admin</span>
                      ` : `
                        <span class="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded font-medium">User</span>
                      `}
                    </td>

                    <td class="py-3.5 text-zinc-500">
                      ${new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </td>

                    <td class="py-3.5 text-right pr-1">
                      ${!isSelf ? `
                        <button 
                          data-user-id="${escapeHtml(u.id)}"
                          data-target-role="${isAdmin ? 'user' : 'admin'}"
                          class="toggle-role-btn text-[11px] px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition font-medium"
                        >
                          ${isAdmin ? 'Ubah jadi User' : 'Jadikan Admin'}
                        </button>
                      ` : `
                        <span class="text-[11px] text-zinc-400 italic">Akun aktif</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  const scripts = `
    <script>
      document.querySelectorAll('.toggle-role-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const userId = btn.getAttribute('data-user-id');
          const targetRole = btn.getAttribute('data-target-role');

          if (!confirm('Ubah role pengguna ini menjadi "' + targetRole + '"?')) return;

          try {
            const res = await fetch('/api/admin/users/' + userId + '/role', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: targetRole })
            });

            if (res.ok) {
              window.location.reload();
            } else {
              const data = await res.json();
              alert(data.error || 'Gagal mengubah role.');
            }
          } catch {
            alert('Kesalahan jaringan.');
          }
        });
      });
    </script>
  `;

  return layout({ title: 'Direktori Pengguna', user, content, scripts, activeNav: 'admin-users' });
}
