import { layout, escapeHtml } from '../layout';
import { accountNav } from './nav';
import type { User } from '../../types';

export interface AccountProfileProps {
  user: User;
}

export function accountProfileView({ user }: AccountProfileProps): string {
  const content = `
    <div class="w-full max-w-2xl mx-auto">
      
      <!-- Page Header -->
      <div class="mb-4">
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Akun Saya
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Kelola informasi identitas akun terpusat Anda di ekosistem TEN.
        </p>
      </div>

      ${accountNav('profile')}

      <div class="space-y-6">
        <!-- Personal Identity Card -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xl flex-shrink-0">
              ${escapeHtml((user.name || user.email).charAt(0).toUpperCase())}
            </div>

            <div class="flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-base font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(user.name)}</span>
                ${user.role === 'admin' ? `
                  <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">Administrator</span>
                ` : `
                  <span class="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded font-medium">Pengguna</span>
                `}
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

        <!-- Edit Profile Details Form -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Perbarui Informasi Profil
          </h2>

          <div id="profile-alert" class="hidden mb-4 p-3 rounded-lg text-xs"></div>

          <form id="profile-form" class="space-y-4 max-w-md">
            <div>
              <label for="profile-name" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Lengkap
              </label>
              <input 
                type="text" 
                id="profile-name" 
                value="${escapeHtml(user.name)}"
                required
                class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-zinc-500 mb-1">
                Alamat Email (Primer)
              </label>
              <input 
                type="email" 
                value="${escapeHtml(user.email)}"
                disabled
                class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 cursor-not-allowed"
              />
              <p class="text-[11px] text-zinc-400 mt-1">Email digunakan sebagai pengenal SSO pada seluruh aplikasi satelit.</p>
            </div>

            <button 
              type="submit" 
              id="profile-submit-btn"
              class="py-2 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>

    </div>
  `;

  const scripts = `
    <script>
      const form = document.getElementById('profile-form');
      const alertBox = document.getElementById('profile-alert');
      const btn = document.getElementById('profile-submit-btn');

      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.className = 'hidden mb-4 p-3 rounded-lg text-xs';
        const name = document.getElementById('profile-name').value.trim();

        btn.disabled = true;
        btn.textContent = 'Menyimpan...';

        try {
          const res = await fetch('/api/auth/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });

          const data = await res.json();
          if (!res.ok) {
            alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
            alertBox.textContent = data.message || data.error || 'Gagal memperbarui profil.';
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
            return;
          }

          alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400';
          alertBox.textContent = 'Profil berhasil diperbarui!';
          setTimeout(() => window.location.reload(), 800);
        } catch (err) {
          alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          alertBox.textContent = 'Kesalahan jaringan.';
          btn.disabled = false;
          btn.textContent = 'Simpan Perubahan';
        }
      });
    </script>
  `;

  return layout({ title: 'Profil Saya', user, content, scripts });
}
