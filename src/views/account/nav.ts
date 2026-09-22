export function accountNav(activeTab: 'profile' | 'security' | 'apps'): string {
  const tabs = [
    { id: 'profile', label: 'Profil', href: '/account' },
    { id: 'security', label: 'Keamanan', href: '/account/security' },
    { id: 'apps', label: 'Aplikasi', href: '/account/apps' },
  ];

  return `
    <div class="mb-5 sm:mb-6">
      <!-- Native App Segmented Control -->
      <nav class="bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-xl flex items-center gap-1 max-w-md shadow-inner">
        ${tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return `
            <a 
              href="${tab.href}" 
              class="flex-1 py-2 px-2.5 text-center text-xs font-medium rounded-lg transition-all touch-press ${
                isActive 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold' 
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }"
            >
              ${tab.label}
            </a>
          `;
        }).join('')}
      </nav>
    </div>
  `;
}
