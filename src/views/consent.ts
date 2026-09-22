import { layout, escapeHtml } from './layout';

export interface ConsentProps {
  clientId: string;
  clientName?: string;
  scopes: string[];
  user: {
    name: string;
    email: string;
  };
}

export function consentView({ clientId, clientName, scopes, user }: ConsentProps): string {
  const displayName = clientName || clientId;

  const scopeDescriptions: Record<string, { label: string; desc: string; icon: string }> = {
    openid: {
      label: 'Identitas Pengguna (OpenID)',
      desc: 'Mengakses ID unik akun Anda untuk memverifikasi autentikasi.',
      icon: `<svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    },
    profile: {
      label: 'Informasi Profil Dasar',
      desc: 'Melihat nama lengkap, foto profil, dan preferensi akun Anda.',
      icon: `<svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>`
    },
    email: {
      label: 'Alamat Email',
      desc: 'Melihat alamat email primer dan status verifikasi email Anda.',
      icon: `<svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
    }
  };

  const content = `
    <div class="w-full max-w-md mx-auto">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm">
        
        <!-- App Identity Header -->
        <div class="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div class="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-lg">
            ${escapeHtml(displayName.charAt(0).toUpperCase())}
          </div>
          <div>
            <h1 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              Otorisasi <span class="text-zinc-900 dark:text-zinc-50 underline decoration-zinc-300 underline-offset-2">${escapeHtml(displayName)}</span>
            </h1>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Aplikasi ini meminta izin untuk mengakses akun TEN Anda.
            </p>
          </div>
        </div>

        <!-- Current User Card -->
        <div class="mb-5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-semibold text-xs text-zinc-700 dark:text-zinc-300">
              ${escapeHtml(user.name.charAt(0).toUpperCase())}
            </div>
            <div>
              <div class="text-xs font-medium text-zinc-900 dark:text-zinc-100">${escapeHtml(user.name)}</div>
              <div class="text-[11px] text-zinc-500">${escapeHtml(user.email)}</div>
            </div>
          </div>
          <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            Masuk
          </span>
        </div>

        <div id="consent-alert" class="hidden mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400"></div>

        <!-- Requested Scopes -->
        <div class="space-y-3 mb-6">
          <div class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Izin Yang Diminta:
          </div>

          <div class="space-y-2">
            ${scopes.map(scope => {
              const info = scopeDescriptions[scope] || {
                label: scope,
                desc: 'Izin tambahan yang dibutuhkan oleh aplikasi ini.',
                icon: `<svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
              };
              return `
                <div class="flex items-start gap-3 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                  <div class="mt-0.5 flex-shrink-0">${info.icon}</div>
                  <div>
                    <div class="text-xs font-medium text-zinc-900 dark:text-zinc-200">${info.label}</div>
                    <div class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">${info.desc}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          Dengan menyetujui, Anda mengizinkan aplikasi ini untuk mengakses informasi Anda sesuai dengan Kebijakan Privasi TEN. Anda dapat mencabut akses kapan saja melalui profil Anda.
        </p>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            id="deny-btn"
            class="flex-1 py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Tolak
          </button>
          <button 
            type="button" 
            id="approve-btn"
            class="flex-1 py-2.5 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition flex items-center justify-center gap-2"
          >
            Setujui & Lanjutkan
          </button>
        </div>

      </div>
    </div>
  `;

  const scripts = `
    <script>
      const approveBtn = document.getElementById('approve-btn');
      const denyBtn = document.getElementById('deny-btn');
      const alertBox = document.getElementById('consent-alert');

      function showError(msg) {
        alertBox.textContent = msg;
        alertBox.classList.remove('hidden');
      }

      async function submitConsent(accept) {
        approveBtn.disabled = true;
        denyBtn.disabled = true;
        approveBtn.innerHTML = '<span>Memproses...</span>';

        const urlParams = new URLSearchParams(window.location.search);
        const scopeParam = urlParams.get('scope') || '${scopes.join(' ')}';
        const claimsParam = urlParams.get('claims');
        const requestedClaims = claimsParam ? JSON.parse(claimsParam) : undefined;

        try {
          const res = await fetch('/api/auth/oauth2/consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accept: accept,
              scope: scopeParam,
              claims: requestedClaims
            })
          });

          const data = await res.json();

          if (!res.ok) {
            showError(data.message || data.error || 'Gagal memproses persetujuan OAuth.');
            approveBtn.disabled = false;
            denyBtn.disabled = false;
            approveBtn.innerHTML = 'Setujui & Lanjutkan';
            return;
          }

          if (data.redirect_uri || data.url) {
            window.location.href = data.redirect_uri || data.url;
          } else {
            // Fallback: reload or redirect to app callback
            window.location.reload();
          }
        } catch (err) {
          showError('Terjadi kesalahan jaringan.');
          approveBtn.disabled = false;
          denyBtn.disabled = false;
          approveBtn.innerHTML = 'Setujui & Lanjutkan';
        }
      }

      approveBtn.addEventListener('click', () => submitConsent(true));
      denyBtn.addEventListener('click', () => submitConsent(false));
    </script>
  `;

  return layout({ title: 'Otorisasi Aplikasi', user, content, scripts });
}
