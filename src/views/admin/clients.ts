import { layout, escapeHtml } from '../layout';
import { adminNav } from './nav';
import type { User } from '../../types';

export interface AdminClientsProps {
  user: User;
  clients: Array<{
    id: string;
    clientId: string;
    clientSecret?: string | null;
    name: string;
    redirectUris: string;
    scopes?: string | null;
    skipConsent?: number | null;
    createdAt?: number | Date | null;
  }>;
}

export function adminClientsView({ user, clients = [] }: AdminClientsProps): string {
  const content = `
    <div class="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Aplikasi Satelit (OAuth)
            </h1>
            <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-mono font-bold">RFC 7591</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Konfigurasi aplikasi satelit (*.ten.my.id) yang diizinkan melakukan SSO.
          </p>
        </div>

        <button 
          id="open-modal-btn"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs active:scale-[0.98] transition shadow-sm touch-press"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Daftarkan Klien Baru</span>
        </button>
      </div>

      ${adminNav('clients')}

      <!-- Registered Clients List -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Daftar Klien Terdaftar (${clients.length})
        </h2>

        ${clients.length > 0 ? `
          <div class="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            ${clients.map(client => {
              let parsedRedirects: string[] = [];
              try {
                parsedRedirects = typeof client.redirectUris === 'string' ? JSON.parse(client.redirectUris) : client.redirectUris;
              } catch {
                parsedRedirects = [client.redirectUris];
              }

              return `
                <div class="py-5 first:pt-0 last:pb-0 space-y-3.5">
                  <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-base text-zinc-700 dark:text-zinc-300 shadow-sm flex-shrink-0">
                        ${escapeHtml((client.name || client.clientId).charAt(0).toUpperCase())}
                      </div>
                      <div>
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            ${escapeHtml(client.name || 'Unnamed App')}
                          </span>
                          ${client.skipConsent ? `
                            <span class="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">Skip Consent</span>
                          ` : `
                            <span class="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">Consent</span>
                          `}
                        </div>
                        <div class="text-[11px] text-zinc-500 font-mono mt-0.5">
                          ID: ${escapeHtml(client.id)}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 pt-1 sm:pt-0">
                      <button 
                        data-rotate-id="${escapeHtml(client.id)}"
                        data-client-name="${escapeHtml(client.name)}"
                        class="rotate-btn flex-1 sm:flex-none text-center text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition font-medium"
                      >
                        Putar Secret
                      </button>
                      <button 
                        data-delete-id="${escapeHtml(client.id)}"
                        data-client-name="${escapeHtml(client.name)}"
                        class="delete-btn flex-1 sm:flex-none text-center text-xs px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 active:scale-[0.98] transition font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <!-- Client Credentials Box (Touch-friendly copy on mobile) -->
                  <div class="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3.5 space-y-2.5 text-xs">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span class="text-zinc-500 font-medium">Client ID:</span>
                      <div class="flex items-center gap-2">
                        <code class="font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-zinc-800 dark:text-zinc-200 text-[11px] select-all break-all">
                          ${escapeHtml(client.clientId)}
                        </code>
                        <button 
                          data-copy="${escapeHtml(client.clientId)}" 
                          class="copy-btn p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 touch-press"
                          title="Salin Client ID"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        </button>
                      </div>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span class="text-zinc-500 font-medium">Client Secret:</span>
                      <div class="flex items-center gap-2">
                        <code id="secret-${escapeHtml(client.id)}" data-secret="${escapeHtml(client.clientSecret || '')}" class="font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-zinc-800 dark:text-zinc-200 text-[11px] select-all break-all">
                          &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                        </code>
                        <button 
                          data-toggle-id="${escapeHtml(client.id)}"
                          class="toggle-secret-btn p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 touch-press"
                          title="Tampilkan/Sembunyikan Secret"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button 
                          data-copy="${escapeHtml(client.clientSecret || '')}" 
                          class="copy-btn p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 touch-press"
                          title="Salin Client Secret"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        </button>
                      </div>
                    </div>

                    <div class="pt-1">
                      <span class="text-zinc-500 font-medium block mb-1">Redirect URIs:</span>
                      <div class="space-y-1">
                        ${parsedRedirects.map(uri => `
                          <div class="font-mono text-[11px] text-zinc-600 dark:text-zinc-400 truncate bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-800">
                            ${escapeHtml(uri)}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="text-center py-12 text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            Belum ada aplikasi satelit yang terdaftar.
          </div>
        `}
      </div>

    </div>

    <!-- Modal Create Client (Native Bottom Sheet on Mobile, Modal on Desktop) -->
    <div id="create-modal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="bg-white dark:bg-zinc-900 border-t sm:border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto safe-bottom">
        
        <!-- Mobile Bottom Sheet Grab Handle -->
        <div class="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden"></div>

        <button id="close-modal-btn" class="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 touch-press">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Daftarkan Klien Satelit
        </h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
          Sistem IAM akan menerbitkan Client ID dan Secret secara otomatis.
        </p>

        <div id="modal-alert" class="hidden mb-4 p-3 rounded-xl text-xs"></div>

        <form id="create-client-form" class="space-y-4">
          <div>
            <label for="client-name" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nama Aplikasi Satelit
            </label>
            <input 
              type="text" 
              id="client-name" 
              required
              placeholder="Contoh: Aplikasi Absensi TEN"
              class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <div>
            <label for="client-id-custom" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Client ID (Opsional, kosongkan untuk generate otomatis)
            </label>
            <input 
              type="text" 
              id="client-id-custom" 
              placeholder="Contoh: absensi-app"
              class="w-full px-3.5 py-3 sm:py-2 text-base sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <div>
            <label for="redirect-uris" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Allowed Redirect URIs (Satu per baris jika lebih dari satu)
            </label>
            <textarea 
              id="redirect-uris" 
              required
              rows="3"
              placeholder="https://absensi.ten.my.id/api/auth/callback&#10;http://localhost:3000/api/auth/callback"
              class="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            ></textarea>
            <p class="text-[11px] text-zinc-500 mt-1">URI tempat pengiriman Authorization Code setelah pengguna menyetujui SSO.</p>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="skip-consent" class="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-0" />
            <label for="skip-consent" class="text-xs text-zinc-700 dark:text-zinc-300 font-medium select-none">
              Aplikasi Internal Tepercaya (Lewati layar Consent)
            </label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              id="cancel-modal-btn"
              class="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              id="create-submit-btn"
              class="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs active:scale-[0.98] transition shadow-sm"
            >
              Daftarkan Klien
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const scripts = `
    <script>
      const modal = document.getElementById('create-modal');
      const openModalBtn = document.getElementById('open-modal-btn');
      const closeModalBtn = document.getElementById('close-modal-btn');
      const cancelModalBtn = document.getElementById('cancel-modal-btn');
      const form = document.getElementById('create-client-form');
      const alertBox = document.getElementById('modal-alert');
      const submitBtn = document.getElementById('create-submit-btn');

      openModalBtn?.addEventListener('click', () => {
        alertBox.className = 'hidden mb-4 p-3 rounded-xl text-xs';
        form.reset();
        modal.classList.remove('hidden');
      });

      const closeModal = () => modal.classList.add('hidden');
      closeModalBtn?.addEventListener('click', closeModal);
      cancelModalBtn?.addEventListener('click', closeModal);

      // Copy Buttons
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const text = btn.getAttribute('data-copy');
          if (!text) return;
          try {
            await navigator.clipboard.writeText(text);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
            setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
        });
      });

      // Toggle Secret Visibility
      document.querySelectorAll('.toggle-secret-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-toggle-id');
          const codeEl = document.getElementById('secret-' + id);
          if (!codeEl) return;

          const secret = codeEl.getAttribute('data-secret');
          if (codeEl.textContent.trim().startsWith('•')) {
            codeEl.textContent = secret;
          } else {
            codeEl.innerHTML = '&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;';
          }
        });
      });

      // Submit Form (Create Client)
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.className = 'hidden mb-4 p-3 rounded-xl text-xs';

        const name = document.getElementById('client-name').value.trim();
        const customId = document.getElementById('client-id-custom').value.trim();
        const rawUris = document.getElementById('redirect-uris').value.trim();
        const skipConsent = document.getElementById('skip-consent').checked;

        const redirectUris = rawUris.split(/\\r?\\n/).map(u => u.trim()).filter(Boolean);

        if (!name || redirectUris.length === 0) {
          alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          alertBox.textContent = 'Nama dan minimal satu Redirect URI wajib diisi.';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Mendaftarkan...';

        try {
          const res = await fetch('/api/admin/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              clientId: customId || undefined,
              redirectUris,
              skipConsent
            })
          });

          const data = await res.json();

          if (!res.ok) {
            alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
            alertBox.textContent = data.error || data.message || 'Gagal mendaftarkan klien.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Daftarkan Klien';
            return;
          }

          alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400';
          alertBox.textContent = 'Aplikasi berhasil didaftarkan!';
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } catch (err) {
          alertBox.className = 'mb-4 p-3 rounded-xl text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          alertBox.textContent = 'Kesalahan jaringan.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Daftarkan Klien';
        }
      });

      // Rotate Secret
      document.querySelectorAll('.rotate-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = btn.getAttribute('data-rotate-id');
          const name = btn.getAttribute('data-client-name');
          if (!confirm('Putar secret untuk "' + name + '"? Klien yang menggunakan secret lama harus diperbarui.')) return;

          try {
            const res = await fetch('/api/admin/clients/' + id + '/rotate', { method: 'POST' });
            if (res.ok) {
              window.location.reload();
            } else {
              alert('Gagal memutar secret.');
            }
          } catch {
            alert('Kesalahan jaringan.');
          }
        });
      });

      // Delete Client
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = btn.getAttribute('data-delete-id');
          const name = btn.getAttribute('data-client-name');
          if (!confirm('Hapus aplikasi "' + name + '"? Aplikasi tidak akan dapat melakukan SSO lagi.')) return;

          try {
            const res = await fetch('/api/admin/clients/' + id, { method: 'DELETE' });
            if (res.ok) {
              window.location.reload();
            } else {
              alert('Gagal menghapus klien.');
            }
          } catch {
            alert('Kesalahan jaringan.');
          }
        });
      });
    </script>
  `;

  return layout({ title: 'Aplikasi Satelit', user, content, scripts, activeNav: 'admin-clients' });
}
