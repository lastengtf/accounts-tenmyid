import { layout } from './layout';

export interface RegisterProps {
  error?: string;
  redirectUrl?: string;
}

export function registerView({ error, redirectUrl = '' }: RegisterProps = {}): string {
  const content = `
    <div class="w-full max-w-sm mx-auto">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm">
        
        <div class="mb-6 text-center">
          <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Buat Akun TEN Baru
          </h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Daftarkan identitas Anda untuk akses Single Sign-On.
          </p>
        </div>

        <div id="alert-box" class="${error ? '' : 'hidden'} mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
          ${error || ''}
        </div>

        <form id="register-form" class="space-y-4">
          <input type="hidden" id="redirect-url" value="${redirectUrl}" />

          <div>
            <label for="name" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nama Lengkap
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              autocomplete="name"
              placeholder="Ahmad Fauzi"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition"
            />
          </div>

          <div>
            <label for="email" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Alamat Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              autocomplete="email"
              placeholder="nama@ten.my.id"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition"
            />
          </div>

          <div>
            <label for="password" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Kata Sandi
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              autocomplete="new-password"
              placeholder="Minimal 8 karakter"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition"
            />
          </div>

          <div>
            <label for="confirm-password" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirm-password" 
              required 
              autocomplete="new-password"
              placeholder="Ulangi kata sandi"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition"
            />
          </div>

          <button 
            type="submit" 
            id="submit-btn"
            class="w-full py-2.5 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2"
          >
            <span>Daftar Akun</span>
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Sudah memiliki akun? 
          <a href="/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}" class="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
            Masuk ke akun
          </a>
        </div>

      </div>
    </div>
  `;

  const scripts = `
    <script>
      const form = document.getElementById('register-form');
      const submitBtn = document.getElementById('submit-btn');
      const alertBox = document.getElementById('alert-box');

      function showError(msg) {
        alertBox.textContent = msg;
        alertBox.classList.remove('hidden');
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.classList.add('hidden');
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const redirectInput = document.getElementById('redirect-url').value;

        if (password.length < 8) {
          showError('Kata sandi harus minimal 8 karakter.');
          return;
        }

        if (password !== confirmPassword) {
          showError('Konfirmasi kata sandi tidak cocok.');
          return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Mendaftarkan...</span>';

        try {
          const res = await fetch('/api/auth/sign-up/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });

          let data;
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await res.json();
          } else {
            const text = await res.text();
            data = { message: text || ('Server Error (' + res.status + ')') };
          }

          if (!res.ok) {
            showError(data.message || data.error || 'Gagal mendaftar. Email mungkin sudah terdaftar.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Daftar Akun</span>';
            return;
          }

          // Handle redirect
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = redirectInput || urlParams.get('redirect') || urlParams.get('callbackURL') || '/account';
          window.location.href = callbackUrl;
        } catch (err) {
          showError('Gagal memproses permintaan: ' + (err.message || 'Kesalahan jaringan.'));
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Daftar Akun</span>';
        }
      });
    </script>
  `;

  return layout({ title: 'Daftar Akun', content, scripts });
}
