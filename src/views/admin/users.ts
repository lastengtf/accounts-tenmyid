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
    <div class="w-full max-w-4xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Direktori Pengguna Ekosistem
            </h1>
            <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded font-mono font-medium">RBAC DIRECTORY</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Daftar seluruh akun terdaftar dan pengaturan hak akses role di platform TEN.
          </p>
        </div>
      </div>

      ${adminNav('users')}

      <!-- Users Table Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Pengguna Terdaftar (${users.length})
        </h2>

        <div class="overflow-x-auto">
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
                        <div class="w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
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
                          class="toggle-role-btn text-[11px] px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium"
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
          const userId = e.target.getAttribute('data-user-id');
          const targetRole = e.target.getAttribute('data-target-role');

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

  return layout({ title: 'Direktori Pengguna', user, content, scripts });
}
