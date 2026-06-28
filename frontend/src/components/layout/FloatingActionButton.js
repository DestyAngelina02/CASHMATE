'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MonitorSmartphone, Package, Users, Truck, BarChart3, FileText } from 'lucide-react';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { href: '/sales/pos', icon: <MonitorSmartphone className="w-4 h-4" />, label: 'Kasir Baru (POS)' },
    { href: '/inventory/products', icon: <Package className="w-4 h-4" />, label: 'Tambah Produk' },
    { href: '/customers', icon: <Users className="w-4 h-4" />, label: 'Pelanggan Baru' },
    { href: '/inventory/suppliers', icon: <Truck className="w-4 h-4" />, label: 'Supplier Baru' },
    { href: '/inventory/stock', icon: <BarChart3 className="w-4 h-4" />, label: 'Penyesuaian Stok' },
    { href: '/reports', icon: <FileText className="w-4 h-4" />, label: 'Buat Laporan' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all"
        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
      >
        <Plus className="w-7 h-7" strokeWidth={3} />
      </button>

      {/* Menu Options */}
      <div 
        className={`absolute bottom-full right-0 mb-4 transition-all duration-200 flex flex-col gap-2 items-end origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
