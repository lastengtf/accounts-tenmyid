export function adminNav(activeTab: 'dashboard' | 'clients' | 'users' | 'settings'): string {
  const tabs = [
    { id: 'dashboard', label: 'Ringkasan Sistem', href: '/admin' },
    { id: 'clients', label: 'Aplikasi Satelit (OAuth)', href: '/admin/clients' },
    { id: 'users', label: 'Direktori Pengguna', href: '/admin/users' },
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
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold' 
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
