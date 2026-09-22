import { layout, escapeHtml } from '../layout';
import { accountNav } from './nav';
import type { User, Session } from '../../types';

export interface AccountSecurityProps {
  user: User;
  sessions?: Session[];
  currentSessionToken?: string;
}

export function accountSecurityView({ user, sessions = [], currentSessionToken = '' }: AccountSecurityProps): string {
  const content = `
    <div class="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      <!-- Page Header -->
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Keamanan Akun
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Kredensial login, kata sandi, dan sesi aktif perangkat.
        </p>
      </div>

      ${accountNav('security')}

      <div class="space-y-4 sm:space-y-6">
        <!-- Change Password Card (Native Form) -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Ubah Kata Sandi
          </h2>

          <div id="password-alert" class="hidden mb-4 p-3 rounded-xl text-xs"></div>

          <form id="password-form" class="space-y-4">
            <div>
              <label for="current-password" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Kata Sandi Saat Ini
              </label>
              <input 
                type="password" 
                id="current-password" 
                required
                class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
              />
            </div>

            <div>
              <label for="new-password" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Kata Sandi Baru
              </label>
              <input 
                type="password" 
                id="new-password" 
                required
                minlength="8"
                placeholder="Minimal 8 karakter"
                class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
              />
            </div>

            <div>
              <label for="confirm-new-password" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <input 
                type="password" 
                id="confirm-new-password" 
                required
                class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
              />
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                id="password-submit-btn"
                class="w-full sm:w-auto py-3 sm:py-2.5 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition shadow-sm"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>

        <!-- Active Sessions Card -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Sesi Perangkat Aktif (${sessions.length})
              </h2>
              <p class="text-xs text-zinc-500 mt-0.5">Perangkat yang saat ini terautentikasi ke akun Anda.</p>
            </div>

            ${sessions.length > 1 ? `
              <button 
                id="revoke-other-sessions-btn"
                class="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-[0.98] transition font-semibold"
              >
                Keluar Dari Perangkat Lain
              </button>
            ` : ''}
          </div>

          <div class="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            ${sessions.map(s => {
              const isCurrent = s.token === currentSessionToken;
              return `
                <div class="py-3.5 flex items-start sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div class="flex items-start sm:items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0 mt-0.5 sm:mt-0">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center gap-2">
                        <span class="break-all">${escapeHtml(s.userAgent || 'Browser')}</span>
                        ${isCurrent ? `
                          <span class="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">Perangkat Ini</span>
                        ` : ''}
                      </div>
                      <div class="text-[11px] text-zinc-500 mt-0.5">
                        IP: <code class="font-mono">${escapeHtml(s.ipAddress || '127.0.0.1')}</code> &bull; Exp: ${new Date(s.expiresAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

    </div>
  `;

  const scripts = `
    <script>
      // Change Password handler
      const pwdForm = document.getElementById('password-form');
      const pwdAlert = document.getElementById('password-alert');
      const pwdBtn = document.getElementById('password-submit-btn');

      pwdForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        pwdAlert.className = 'hidden mb-4 p-3 rounded-xl text-xs';
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
          pwdAlert.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          pwdAlert.textContent = 'Konfirmasi kata sandi baru tidak cocok.';
          return;
        }

        pwdBtn.disabled = true;
        pwdBtn.textContent = 'Memperbarui...';

        try {
          const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword, revokeOtherSessions: true })
          });

          const data = await res.json();
          if (!res.ok) {
            pwdAlert.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
            pwdAlert.textContent = data.message || data.error || 'Gagal mengubah kata sandi.';
            pwdBtn.disabled = false;
            pwdBtn.textContent = 'Perbarui Kata Sandi';
            return;
          }

          pwdAlert.className = 'mb-4 p-3 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400';
          pwdAlert.textContent = 'Kata sandi berhasil diperbarui.';
          pwdForm.reset();
          pwdBtn.disabled = false;
          pwdBtn.textContent = 'Perbarui Kata Sandi';
        } catch (err) {
          pwdAlert.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          pwdAlert.textContent = 'Terjadi kesalahan jaringan.';
          pwdBtn.disabled = false;
          pwdBtn.textContent = 'Perbarui Kata Sandi';
        }
      });

      // Revoke other sessions
      document.getElementById('revoke-other-sessions-btn')?.addEventListener('click', async () => {
        if (!confirm('Keluar dari semua sesi di perangkat lain?')) return;
        try {
          const res = await fetch('/api/auth/revoke-other-sessions', { method: 'POST' });
          if (res.ok) {
            window.location.reload();
          } else {
            alert('Gagal mencabut sesi lain.');
          }
        } catch {
          alert('Gagal mencabut sesi lain.');
        }
      });
    </script>
  `;

  return layout({ title: 'Keamanan Akun', user, content, scripts, activeNav: 'security' });
}
