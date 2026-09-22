export function accountNav(activeTab: 'profile' | 'security' | 'apps'): string {
  const tabs = [
    { id: 'profile', label: 'Profil Saya', href: '/account' },
    { id: 'security', label: 'Keamanan & Sesi', href: '/account/security' },
    { id: 'apps', label: 'Aplikasi Terhubung', href: '/account/apps' },
  ];

  return `
    <div class="border-b border-zinc-200 dark:border-zinc-800 mb-6">
      <nav class="flex space-x-6">
        ${tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return `
            <a 
              href="${tab.href}" 
              class="pb-3 text-xs font-medium transition border-b-2 ${
                isActive 
                  ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 font-semibold' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
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
