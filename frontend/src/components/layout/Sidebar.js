import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transaksi (POS)', path: '/transactions', icon: '🧾' },
    { name: 'Produk', path: '/products', icon: '📦' },
    { name: 'Kategori', path: '/categories', icon: '🏷️' },
    { name: 'Supplier', path: '/suppliers', icon: '🚚' },
    { name: 'Pengguna', path: '/users', icon: '👥' },
    { name: 'Laporan', path: '/reports', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-900 h-screen hidden md:flex flex-col sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-900">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-neutral-950 text-sm shadow-emerald-500/20">
            C
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            CASHMATE
          </span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all group"
          >
            <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-900">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full text-left">
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
