import { layout } from './layout';

export interface LoginProps {
  error?: string;
  redirectUrl?: string;
}

export function loginView({ error, redirectUrl = '' }: LoginProps = {}): string {
  const content = `
    <div class="w-full max-w-sm mx-auto">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm">
        
        <div class="mb-6 text-center">
          <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Masuk ke Akun TEN
          </h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Gunakan kredensial terpusat untuk mengakses semua layanan TEN.
          </p>
        </div>

        <div id="alert-box" class="${error ? '' : 'hidden'} mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
          ${error || ''}
        </div>

        <form id="login-form" class="space-y-4">
          <input type="hidden" id="redirect-url" value="${redirectUrl}" />
          
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
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Kata Sandi
              </label>
              <a href="#" class="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition">
                Lupa sandi?
              </a>
            </div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              autocomplete="current-password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition"
            />
          </div>

          <button 
            type="submit" 
            id="submit-btn"
            class="w-full py-2.5 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2"
          >
            <span>Masuk</span>
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Belum memiliki akun? 
          <a href="/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}" class="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
            Daftar sekarang
          </a>
        </div>

      </div>
    </div>
  `;

  const scripts = `
    <script>
      const form = document.getElementById('login-form');
      const submitBtn = document.getElementById('submit-btn');
      const alertBox = document.getElementById('alert-box');

      function showError(msg) {
        alertBox.textContent = msg;
        alertBox.classList.remove('hidden');
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.classList.add('hidden');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const redirectInput = document.getElementById('redirect-url').value;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Memproses...</span>';

        try {
          const res = await fetch('/api/auth/sign-in/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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
            showError(data.message || data.error || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Masuk</span>';
            return;
          }

          // Handle redirect
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = redirectInput || urlParams.get('redirect') || urlParams.get('callbackURL') || '/account';
          window.location.href = callbackUrl;
        } catch (err) {
          showError('Gagal memproses permintaan: ' + (err.message || 'Kesalahan jaringan.'));
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Masuk</span>';
        }
      });
    </script>
  `;

  return layout({ title: 'Masuk', content, scripts });
}
