'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Receipt, MonitorSmartphone, ClipboardList, CreditCard,
  Package, Tags, FolderTree, BarChart3, QrCode, Truck,
  Users, UserSquare, Star, LineChart, PieChart, FileText,
  Lock, Settings, Store, ReceiptText, LogOut
} from 'lucide-react';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Sales Center',
    items: [
      {
        name: 'Sales Center', icon: Receipt,
        subItems: [
          { name: 'POS Terminal', path: '/sales/pos', icon: MonitorSmartphone },
          { name: 'Transaksi', path: '/sales/transactions', icon: ClipboardList },
          { name: 'Riwayat Bayar', path: '/sales/payment-history', icon: CreditCard },
        ]
      },
    ]
  },
  {
    title: 'Inventory',
    items: [
      {
        name: 'Inventory', icon: Package,
        subItems: [
          { name: 'Produk', path: '/inventory/products', icon: Tags },
          { name: 'Kategori', path: '/inventory/categories', icon: FolderTree },
          { name: 'Manajemen Stok', path: '/inventory/stock', icon: BarChart3 },
          { name: 'Barcode Center', path: '/inventory/barcode', icon: QrCode },
          { name: 'Supplier', path: '/inventory/suppliers', icon: Truck },
        ]
      },
    ]
  },
  {
    title: 'Pelanggan',
    items: [
      {
        name: 'Customers', icon: Users,
        subItems: [
          { name: 'Daftar Pelanggan', path: '/customers', icon: UserSquare },
          { name: 'Membership', path: '/customers/membership', icon: Star },
        ]
      },
    ]
  },
  {
    title: 'Analytics',
    items: [
      {
        name: 'Analytics', icon: LineChart,
        subItems: [
          { name: 'Sales Analytics', path: '/analytics/sales', icon: PieChart },
          { name: 'Produk Analytics', path: '/analytics/products', icon: Package },
        ]
      },
    ]
  },
  {
    title: 'Laporan',
    items: [
      { name: 'Laporan', path: '/reports', icon: FileText },
    ]
  },
  {
    title: 'Admin',
    items: [
      { name: 'Pengguna', path: '/users', icon: Lock },
      {
        name: 'Pengaturan', icon: Settings,
        subItems: [
          { name: 'Profil Toko', path: '/settings/store', icon: Store },
          { name: 'Template Struk', path: '/settings/receipt', icon: ReceiptText },
        ]
      },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
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
                const Icon = item.icon;

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
                          <Icon className="w-4 h-4 opacity-80" />
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
                        <Icon className="w-4 h-4 opacity-80" />
                        {item.name}
                      </Link>
                    )}

                    {hasSub && open && (
                      <div className="mt-0.5 ml-4 pl-2.5 border-l border-white/5 space-y-0.5 pb-1">
                        {item.subItems.map(sub => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.path}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isActive(sub.path)
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'text-neutral-600 hover:text-neutral-300 hover:bg-white/5'
                              }`}
                            >
                              <SubIcon className="w-3.5 h-3.5 opacity-70" />
                              {sub.name}
                            </Link>
                          );
                        })}
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
        <button onClick={() => router.push('/login')} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}

