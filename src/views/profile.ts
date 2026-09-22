import { layout, escapeHtml } from './layout';

export interface ProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
  };
  authorizedApps?: Array<{
    id: string;
    clientId: string;
    name: string;
    scopes: string;
    createdAt: number | Date;
  }>;
}

export function profileView({ user, authorizedApps = [] }: ProfileProps): string {
  const content = `
    <div class="w-full max-w-2xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Pengaturan Akun & Profil
          </h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Pusat manajemen identitas Single Sign-On (SSO) akun TEN Anda.
          </p>
        </div>
        <button 
          id="logout-main-btn"
          class="text-xs px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition"
        >
          Keluar
        </button>
      </div>

      <!-- Profile Summary Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Informasi Pengguna
        </h2>

        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-lg">
            ${escapeHtml(user.name.charAt(0).toUpperCase())}
          </div>

          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-base font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(user.name)}</span>
              ${user.emailVerified ? `
                <span class="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded font-medium">Terverifikasi</span>
              ` : `
                <span class="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded font-medium">Belum Terverifikasi</span>
              `}
            </div>
            <div class="text-xs text-zinc-600 dark:text-zinc-400">${escapeHtml(user.email)}</div>
            <div class="text-[11px] text-zinc-400 dark:text-zinc-500 pt-1">
              ID Akun: <code class="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">${escapeHtml(user.id)}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Ubah Kata Sandi
        </h2>

        <div id="password-alert" class="hidden mb-4 p-3 rounded-lg text-xs"></div>

        <form id="password-form" class="space-y-4 max-w-md">
          <div>
            <label for="current-password" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Kata Sandi Saat Ini
            </label>
            <input 
              type="password" 
              id="current-password" 
              required
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <div>
            <label for="new-password" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Kata Sandi Baru
            </label>
            <input 
              type="password" 
              id="new-password" 
              required
              minlength="8"
              placeholder="Minimal 8 karakter"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <div>
            <label for="confirm-new-password" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Ulangi Kata Sandi Baru
            </label>
            <input 
              type="password" 
              id="confirm-new-password" 
              required
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <button 
            type="submit" 
            id="password-submit-btn"
            class="py-2 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            Perbarui Kata Sandi
          </button>
        </form>
      </div>

      <!-- Authorized Satellite Applications Card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
          Aplikasi Satelit Terhubung (OAuth 2.0 / OIDC)
        </h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Daftar aplikasi di ekosistem TEN yang memiliki izin akses ke akun Anda.
        </p>

        ${authorizedApps.length > 0 ? `
          <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
            ${authorizedApps.map(app => `
              <div class="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                    ${escapeHtml(app.name.charAt(0).toUpperCase())}
                  </div>
                  <div>
                    <div class="text-xs font-medium text-zinc-900 dark:text-zinc-100">${escapeHtml(app.name)}</div>
                    <div class="text-[11px] text-zinc-500">
                      Izin: <span class="font-mono">${escapeHtml(app.scopes)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  data-revoke-id="${escapeHtml(app.id)}"
                  class="revoke-btn text-[11px] px-2.5 py-1 rounded border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition font-medium"
                >
                  Cabut Akses
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-6 text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            Belum ada aplikasi satelit yang diberikan otorisasi.
          </div>
        `}
      </div>

    </div>
  `;

  const scripts = `
    <script>
      // Logout handler
      document.getElementById('logout-main-btn')?.addEventListener('click', async () => {
        try {
          await fetch('/api/auth/sign-out', { method: 'POST' });
          window.location.href = '/login';
        } catch (e) {
          window.location.reload();
        }
      });

      // Change Password handler
      const pwdForm = document.getElementById('password-form');
      const pwdAlert = document.getElementById('password-alert');
      const pwdBtn = document.getElementById('password-submit-btn');

      pwdForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        pwdAlert.className = 'hidden mb-4 p-3 rounded-lg text-xs';
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
          pwdAlert.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
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
            pwdAlert.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
            pwdAlert.textContent = data.message || data.error || 'Gagal mengubah kata sandi.';
            pwdBtn.disabled = false;
            pwdBtn.textContent = 'Perbarui Kata Sandi';
            return;
          }

          pwdAlert.className = 'mb-4 p-3 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400';
          pwdAlert.textContent = 'Kata sandi berhasil diperbarui.';
          pwdForm.reset();
          pwdBtn.disabled = false;
          pwdBtn.textContent = 'Perbarui Kata Sandi';
        } catch (err) {
          pwdAlert.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          pwdAlert.textContent = 'Terjadi kesalahan jaringan.';
          pwdBtn.disabled = false;
          pwdBtn.textContent = 'Perbarui Kata Sandi';
        }
      });

      // Revoke app consent
      document.querySelectorAll('.revoke-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-revoke-id');
          if (!confirm('Apakah Anda yakin ingin mencabut izin akses aplikasi ini?')) return;

          try {
            const res = await fetch('/api/auth/oauth2/consent/' + id, { method: 'DELETE' });
            if (res.ok) {
              window.location.reload();
            } else {
              alert('Gagal mencabut akses.');
            }
          } catch (err) {
            alert('Kesalahan jaringan.');
          }
        });
      });
    </script>
  `;

  return layout({ title: 'Profil Akun', user, content, scripts });
}
