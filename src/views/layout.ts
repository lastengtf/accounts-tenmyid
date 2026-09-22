export interface LayoutProps {
  title: string;
  user?: {
    name: string;
    email: string;
    role?: string | null;
  } | null;
  content: string;
  scripts?: string;
}

export function layout({ title, user, content, scripts = "" }: LayoutProps): string {
  return `<!DOCTYPE html>
<html lang="id" class="h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | TEN Accounts</title>
  <meta name="description" content="Centralized Identity Provider & SSO for ten.my.id">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'media',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="h-full flex flex-col justify-between">
  <!-- Minimalist Enterprise Header -->
  <header class="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight hover:opacity-90 transition">
        <div class="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
          TEN
        </div>
        <span class="text-sm font-semibold">accounts<span class="text-zinc-400 dark:text-zinc-500 font-normal">.ten.my.id</span></span>
      </a>

      <div class="flex items-center gap-3">
        ${user ? `
          ${user.role === 'admin' ? `
            <a href="/admin" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              Konsol Admin
            </a>
          ` : ''}
          <a href="/account" class="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            ${escapeHtml(user.name || user.email)}
          </a>
          <button id="header-logout-btn" class="text-xs px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            Keluar
          </button>
        ` : `
          <a href="/login" class="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            Masuk
          </a>
          <a href="/register" class="text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
            Daftar
          </a>
        `}
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6">
    ${content}
  </main>

  <!-- Minimalist Enterprise Footer -->
  <footer class="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
    <div class="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        &copy; ${new Date().getFullYear()} TEN IDP &bull; Centralized Identity Provider
      </div>
      <div class="flex items-center gap-4 text-zinc-400 dark:text-zinc-600">
        <span>OAuth 2.1 / OIDC</span>
        <span>&bull;</span>
        <span>Cloudflare Edge</span>
        <span>&bull;</span>
        <span>Better Auth</span>
      </div>
    </div>
  </footer>

  <script>
    const logoutBtn = document.getElementById('header-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('/api/auth/sign-out', { method: 'POST' });
          window.location.href = '/login';
        } catch (e) {
          console.error(e);
          window.location.reload();
        }
      });
    }
  </script>
  ${scripts}
</body>
</html>`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
