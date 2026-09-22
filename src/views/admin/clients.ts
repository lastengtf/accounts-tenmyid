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
    <div class="w-full max-w-4xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Manajemen Aplikasi Satelit (OAuth Clients)
            </h1>
            <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded font-mono font-medium">RFC 7591</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Daftarkan dan atur izin aplikasi satelit (*.ten.my.id) yang diizinkan melakukan Single Sign-On.
          </p>
        </div>

        <button 
          id="open-modal-btn"
          class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition shadow-sm"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          + Tambah Klien Satelit
        </button>
      </div>

      ${adminNav('clients')}

      <!-- Registered Clients List -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
          Daftar Klien Terdaftar (${clients.length})
        </h2>

        ${clients.length > 0 ? `
          <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
            ${clients.map(client => {
              let parsedRedirects: string[] = [];
              try {
                parsedRedirects = typeof client.redirectUris === 'string' ? JSON.parse(client.redirectUris) : client.redirectUris;
              } catch {
                parsedRedirects = [client.redirectUris];
              }

              return `
                <div class="py-5 first:pt-0 last:pb-0 space-y-3">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300">
                        ${escapeHtml((client.name || client.clientId).charAt(0).toUpperCase())}
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            ${escapeHtml(client.name || 'Unnamed App')}
                          </span>
                          ${client.skipConsent ? `
                            <span class="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded font-medium">Tepercaya (Skip Consent)</span>
                          ` : `
                            <span class="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded font-medium">Perlu Persetujuan</span>
                          `}
                        </div>
                        <div class="text-xs text-zinc-500">
                          ID: <code class="font-mono text-[11px]">${escapeHtml(client.id)}</code>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        data-rotate-id="${escapeHtml(client.id)}"
                        data-client-name="${escapeHtml(client.name)}"
                        class="rotate-btn text-xs px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium"
                      >
                        Putar Secret
                      </button>
                      <button 
                        data-delete-id="${escapeHtml(client.id)}"
                        data-client-name="${escapeHtml(client.name)}"
                        class="delete-btn text-xs px-2.5 py-1.5 rounded border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <!-- Credentials Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                      <div class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Client ID</span>
                        <button onclick="copyToClipboard('${escapeHtml(client.clientId)}', this)" class="text-[10px] text-zinc-600 dark:text-zinc-400 hover:underline">Salin</button>
                      </div>
                      <div class="font-mono text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        ${escapeHtml(client.clientId)}
                      </div>
                    </div>

                    <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                      <div class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Client Secret</span>
                        <div class="flex items-center gap-2">
                          <button onclick="toggleSecret('${escapeHtml(client.id)}', this)" class="text-[10px] text-zinc-600 dark:text-zinc-400 hover:underline">Tampilkan</button>
                          <button onclick="copyToClipboard('${escapeHtml(client.clientSecret || '')}', this)" class="text-[10px] text-zinc-600 dark:text-zinc-400 hover:underline">Salin</button>
                        </div>
                      </div>
                      <div id="secret-${escapeHtml(client.id)}" class="font-mono text-xs text-zinc-900 dark:text-zinc-100 truncate" data-secret="${escapeHtml(client.clientSecret || '')}">
                        &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                      </div>
                    </div>
                  </div>

                  <!-- Callback URLs -->
                  <div class="text-xs text-zinc-600 dark:text-zinc-400">
                    <span class="font-medium text-zinc-500">Allowed Redirect URIs:</span>
                    <div class="mt-1 flex flex-wrap gap-1.5">
                      ${parsedRedirects.map(uri => `
                        <span class="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">${escapeHtml(uri)}</span>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="text-center py-10 text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            Belum ada aplikasi satelit yang terdaftar.
          </div>
        `}
      </div>

    </div>

    <!-- Modal Create Client -->
    <div id="create-modal" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-lg relative">
        <button id="close-modal-btn" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Daftarkan Aplikasi Satelit Baru
        </h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
          Sistem IAM akan menerbitkan Client ID dan Client Secret secara otomatis.
        </p>

        <div id="modal-alert" class="hidden mb-4 p-3 rounded-lg text-xs"></div>

        <form id="create-client-form" class="space-y-4">
          <div>
            <label for="client-name" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nama Aplikasi Satelit
            </label>
            <input 
              type="text" 
              id="client-name" 
              required
              placeholder="Contoh: Aplikasi Absensi TEN"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <div>
            <label for="client-id-custom" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Client ID (Opsional, kosongkan untuk auto-generate)
            </label>
            <input 
              type="text" 
              id="client-id-custom"
              placeholder="Contoh: absensi-app"
              class="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          <div>
            <label for="redirect-uris" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Allowed Redirect URIs (Satu per baris jika lebih dari satu)
            </label>
            <textarea 
              id="redirect-uris" 
              required
              rows="3"
              placeholder="https://absensi.ten.my.id/api/auth/callback&#10;http://localhost:3000/api/auth/callback"
              class="w-full px-3 py-2 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            ></textarea>
            <p class="text-[11px] text-zinc-500 mt-1">URI tempat pengiriman Authorization Code setelah pengguna menyetujui login.</p>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="skip-consent" class="rounded border-zinc-300 text-zinc-900 focus:ring-0" />
            <label for="skip-consent" class="text-xs text-zinc-700 dark:text-zinc-300">
              Aplikasi Internal Tepercaya (Lewati layar Consent)
            </label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3">
            <button 
              type="button" 
              id="cancel-modal-btn"
              class="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              id="create-submit-btn"
              class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition"
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
        alertBox.className = 'hidden mb-4 p-3 rounded-lg text-xs';
        form.reset();
        modal.classList.remove('hidden');
      });

      function closeModal() {
        modal.classList.add('hidden');
      }

      closeModalBtn?.addEventListener('click', closeModal);
      cancelModalBtn?.addEventListener('click', closeModal);

      function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = 'Disalin!';
          setTimeout(() => { btn.textContent = original; }, 2000);
        });
      }

      function toggleSecret(id, btn) {
        const el = document.getElementById('secret-' + id);
        const secret = el.getAttribute('data-secret');
        if (el.textContent.includes('•')) {
          el.textContent = secret;
          btn.textContent = 'Sembunyikan';
        } else {
          el.innerHTML = '&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;';
          btn.textContent = 'Tampilkan';
        }
      }

      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.className = 'hidden mb-4 p-3 rounded-lg text-xs';

        const name = document.getElementById('client-name').value.trim();
        const customId = document.getElementById('client-id-custom').value.trim();
        const rawUris = document.getElementById('redirect-uris').value.trim();
        const skipConsent = document.getElementById('skip-consent').checked;

        const redirectUris = rawUris.split('\\n').map(u => u.trim()).filter(Boolean);

        if (redirectUris.length === 0) {
          alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          alertBox.textContent = 'Masukkan minimal satu Redirect URI.';
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
            alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
            alertBox.textContent = data.error || data.message || 'Gagal mendaftarkan klien.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Daftarkan Klien';
            return;
          }

          alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400';
          alertBox.textContent = 'Aplikasi berhasil didaftarkan!';
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } catch (err) {
          alertBox.className = 'mb-4 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400';
          alertBox.textContent = 'Kesalahan jaringan.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Daftarkan Klien';
        }
      });

      // Rotate Secret
      document.querySelectorAll('.rotate-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-rotate-id');
          const name = e.target.getAttribute('data-client-name');
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
          const id = e.target.getAttribute('data-delete-id');
          const name = e.target.getAttribute('data-client-name');
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

  return layout({ title: 'Manajemen Aplikasi Satelit', user, content, scripts });
}
