'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: '⊞' },
    ]
  },
  {
    title: 'Sales Center',
    items: [
      {
        name: 'Sales Center', icon: '🧾',
        subItems: [
          { name: 'POS Terminal', path: '/sales/pos', icon: '🖥️' },
          { name: 'Transaksi', path: '/sales/transactions', icon: '📋' },
          { name: 'Riwayat Bayar', path: '/sales/payment-history', icon: '💳' },
        ]
      },
    ]
  },
  {
    title: 'Inventory',
    items: [
      {
        name: 'Inventory', icon: '📦',
        subItems: [
          { name: 'Produk', path: '/inventory/products', icon: '🏷️' },
          { name: 'Kategori', path: '/inventory/categories', icon: '📁' },
          { name: 'Manajemen Stok', path: '/inventory/stock', icon: '📊' },
          { name: 'Barcode Center', path: '/inventory/barcode', icon: '🔲' },
          { name: 'Supplier', path: '/inventory/suppliers', icon: '🚚' },
        ]
      },
    ]
  },
  {
    title: 'Pelanggan',
    items: [
      {
        name: 'Customers', icon: '👥',
        subItems: [
          { name: 'Daftar Pelanggan', path: '/customers', icon: '👤' },
          { name: 'Membership', path: '/customers/membership', icon: '⭐' },
        ]
      },
    ]
  },
  {
    title: 'Analytics',
    items: [
      {
        name: 'Analytics', icon: '📈',
        subItems: [
          { name: 'Sales Analytics', path: '/analytics/sales', icon: '💰' },
          { name: 'Produk Analytics', path: '/analytics/products', icon: '📦' },
        ]
      },
    ]
  },
  {
    title: 'Laporan',
    items: [
      { name: 'Laporan', path: '/reports', icon: '📄' },
    ]
  },
  {
    title: 'Admin',
    items: [
      { name: 'Pengguna', path: '/users', icon: '🔐' },
      {
        name: 'Pengaturan', icon: '⚙️',
        subItems: [
          { name: 'Profil Toko', path: '/settings/store', icon: '🏪' },
          { name: 'Template Struk', path: '/settings/receipt', icon: '🧾' },
        ]
      },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggle = (name) => setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));

  const isActive = (path) => pathname === path;
  const isGroupActive = (subItems) => subItems?.some(s => pathname.startsWith(s.path));

  return (
    <aside className="w-60 bg-[#0a0a0a] border-r border-white/5 h-screen hidden md:flex flex-col sticky top-0 overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-neutral-950 text-xs shadow-md shadow-emerald-500/30">
            C
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white">CASHMATE</span>
            <span className="ml-1.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">V2</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-2.5 space-y-5 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            <p className="px-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1.5">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const hasSub = !!item.subItems;
                const active = item.path ? isActive(item.path) : isGroupActive(item.subItems);
                const open = openMenus[item.name] ?? active;

                return (
                  <div key={item.name}>
                    {hasSub ? (
                      <button
                        onClick={() => toggle(item.name)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                          active ? 'text-white bg-white/5' : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base opacity-80">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        <svg className={`w-3 h-3 transition-transform opacity-50 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-base opacity-80">{item.icon}</span>
                        {item.name}
                      </Link>
                    )}

                    {hasSub && open && (
                      <div className="mt-0.5 ml-4 pl-2.5 border-l border-white/5 space-y-0.5 pb-1">
                        {item.subItems.map(sub => (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isActive(sub.path)
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-neutral-600 hover:text-neutral-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{sub.icon}</span>
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2.5 border-t border-white/5 shrink-0">
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full">
          <span>🚪</span> Keluar
        </button>
      </div>
    </aside>
  );
}
