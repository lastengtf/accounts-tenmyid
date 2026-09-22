import { layout, escapeHtml } from '../layout';
import { accountNav } from './nav';
import type { User } from '../../types';

export interface AccountProfileProps {
  user: User;
}

export function accountProfileView({ user }: AccountProfileProps): string {
  const content = `
    <div class="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      <!-- Page Header -->
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Akun Saya
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Identitas tunggal untuk seluruh ekosistem aplikasi TEN.
        </p>
      </div>

      ${accountNav('profile')}

      <div class="space-y-4 sm:space-y-6">
        <!-- Personal Identity Card (Native App Card) -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
              ${escapeHtml((user.name || user.email).charAt(0).toUpperCase())}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span class="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">${escapeHtml(user.name)}</span>
                ${user.role === 'admin' ? `
                  <span class="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin</span>
                ` : `
                  <span class="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">Pengguna</span>
                `}
                ${user.emailVerified ? `
                  <span class="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-medium">Terverifikasi</span>
                ` : `
                  <span class="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-medium">Belum Verifikasi</span>
                `}
              </div>
              <div class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 truncate">${escapeHtml(user.email)}</div>
              <div class="text-[11px] text-zinc-400 dark:text-zinc-500 pt-1 font-mono truncate">
                ID: ${escapeHtml(user.id)}
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Details Form -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Informasi Profil
          </h2>

          <div id="profile-alert" class="hidden mb-4 p-3 rounded-xl text-xs"></div>

          <form id="profile-form" class="space-y-4">
            <div>
              <label for="profile-name" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Nama Lengkap
              </label>
              <input 
                type="text" 
                id="profile-name" 
                value="${escapeHtml(user.name)}"
                required
                class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-500 mb-1.5">
                Alamat Email (Akun Primer)
              </label>
              <input 
                type="email" 
                value="${escapeHtml(user.email)}"
                disabled
                class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-800/40 text-zinc-400 cursor-not-allowed"
              />
              <p class="text-[11px] text-zinc-400 mt-1.5">Email digunakan sebagai pengenal SSO pada seluruh aplikasi satelit TEN.</p>
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                id="profile-submit-btn"
                class="w-full sm:w-auto py-3 sm:py-2.5 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
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
        alertBox.className = 'hidden mb-4 p-3 rounded-xl text-xs';
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
            alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
            alertBox.textContent = data.message || data.error || 'Gagal memperbarui profil.';
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
            return;
          }

          alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400';
          alertBox.textContent = 'Profil berhasil diperbarui!';
          setTimeout(() => window.location.reload(), 800);
        } catch (err) {
          alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          alertBox.textContent = 'Kesalahan jaringan.';
          btn.disabled = false;
          btn.textContent = 'Simpan Perubahan';
        }
      });
    </script>
  `;

  return layout({ title: 'Profil Saya', user, content, scripts, activeNav: 'profile' });
}
