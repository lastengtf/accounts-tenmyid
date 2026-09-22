export interface LayoutProps {
  title: string;
  user?: {
    name: string;
    email: string;
    role?: string | null;
  } | null;
  content: string;
  scripts?: string;
  activeNav?: 'profile' | 'security' | 'apps' | 'admin-dashboard' | 'admin-clients' | 'admin-users' | string;
}

export function layout({ title, user, content, scripts = "", activeNav = "" }: LayoutProps): string {
  const isAdminSection = activeNav.startsWith('admin');

  return `<!DOCTYPE html>
<html lang="id" class="h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
<head>
  <meta charset="UTF-8">
  <!-- Viewport configured for native app feel (disables pinch-zoom, supports iPhone notch / dynamic island) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>${title} | TEN Accounts</title>
  <meta name="description" content="Centralized Identity Provider & SSO for ten.my.id">
  
  <!-- Native Web App & PWA Capabilities -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)">

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
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  </script>
  <style>
    /* Native App UX Optimizations */
    * {
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      touch-action: manipulation;
    }
    /* Stop iPhone Safari from zooming when focusing inputs (16px base font size on mobile) */
    @media screen and (max-width: 640px) {
      input, select, textarea {
        font-size: 16px !important;
      }
    }
    /* Safe Area insets for notch and bottom home bar */
    .safe-top {
      padding-top: max(12px, env(safe-area-inset-top));
    }
    .safe-bottom {
      padding-bottom: max(16px, env(safe-area-inset-bottom));
    }
    /* Active touch feedback */
    .touch-press:active {
      transform: scale(0.97);
      opacity: 0.9;
    }
  </style>
</head>
<body class="h-full flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950">
  
  <!-- Native Top App Bar -->
  <header class="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40 safe-top">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight touch-press transition">
        <div class="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm">
          TEN
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold leading-none">accounts<span class="text-zinc-400 dark:text-zinc-500 font-normal">.ten.my.id</span></span>
          <span class="text-[10px] text-zinc-400 dark:text-zinc-500 tracking-wider uppercase font-mono mt-0.5">Identity Provider</span>
        </div>
      </a>

      <!-- Right Header Actions (Desktop & Mobile) -->
      <div class="flex items-center gap-2 sm:gap-3">
        ${user ? `
          <!-- Desktop Nav Links -->
          <div class="hidden sm:flex items-center gap-3">
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
          </div>

          <!-- Mobile Quick Identity Pill -->
          <div class="flex sm:hidden items-center gap-2">
            ${user.role === 'admin' ? `
              <span class="text-[10px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                ADMIN
              </span>
            ` : ''}
            <button id="mobile-quick-logout-btn" class="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 touch-press transition" title="Keluar">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        ` : `
          <a href="/login" class="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition px-2.5 py-1.5">
            Masuk
          </a>
          <a href="/register" class="text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-3.5 py-1.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm touch-press">
            Daftar
          </a>
        `}
      </div>
    </div>
  </header>

  <!-- Main App Canvas -->
  <main class="flex-1 flex flex-col justify-start py-5 sm:py-10 px-3.5 sm:px-6 ${user ? 'pb-28 sm:pb-12' : 'pb-10'}">
    ${content}
  </main>

  <!-- Desktop Footer -->
  <footer class="hidden sm:block border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
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

  <!-- ======================================================== -->
  <!-- Native Mobile Bottom Tab Bar (iOS / Android Style)       -->
  <!-- ======================================================== -->
  ${user ? `
    <nav class="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-200/90 dark:border-zinc-800/90 safe-bottom">
      <div class="grid ${user.role === 'admin' ? (isAdminSection ? 'grid-cols-4' : 'grid-cols-4') : 'grid-cols-3'} h-14">
        
        ${isAdminSection ? `
          <!-- Admin Tabs Mode -->
          <a href="/admin" class="flex flex-col items-center justify-center py-1 touch-press ${activeNav === 'admin-dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="text-[10px] tracking-tight">Ringkasan</span>
          </a>

          <a href="/admin/clients" class="flex flex-col items-center justify-center py-1 touch-press ${activeNav === 'admin-clients' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span class="text-[10px] tracking-tight">Aplikasi</span>
          </a>

          <a href="/admin/users" class="flex flex-col items-center justify-center py-1 touch-press ${activeNav === 'admin-users' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span class="text-[10px] tracking-tight">Pengguna</span>
          </a>

          <a href="/account" class="flex flex-col items-center justify-center py-1 touch-press text-zinc-500 dark:text-zinc-400">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="text-[10px] tracking-tight">Akun Saya</span>
          </a>
        ` : `
          <!-- User Account Mode -->
          <a href="/account/profile" class="flex flex-col items-center justify-center py-1 touch-press ${activeNav === 'profile' ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="text-[10px] tracking-tight">Profil</span>
          </a>

          <a href="/account/security" class="flex flex-col items-center justify-center py-1 touch-press ${activeNav === 'security' ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span class="text-[10px] tracking-tight">Keamanan</span>
          </a>

          <a href="/account/apps" class="flex flex-col items-center justify-center py-1 touch-press ${activeNav === 'apps' ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <span class="text-[10px] tracking-tight">Aplikasi</span>
          </a>

          ${user.role === 'admin' ? `
            <a href="/admin" class="flex flex-col items-center justify-center py-1 touch-press text-indigo-600 dark:text-indigo-400">
              <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span class="text-[10px] font-semibold tracking-tight">Admin</span>
            </a>
          ` : ''}
        `}

      </div>
    </nav>
  ` : ''}

  <script>
    const handleLogout = async () => {
      try {
        await fetch('/api/auth/sign-out', { method: 'POST' });
        window.location.href = '/login';
      } catch (e) {
        console.error(e);
        window.location.reload();
      }
    };

    const logoutBtn = document.getElementById('header-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const mobileLogoutBtn = document.getElementById('mobile-quick-logout-btn');
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
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
