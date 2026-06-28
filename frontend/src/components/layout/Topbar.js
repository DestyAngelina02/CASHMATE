'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Topbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Fetch low stock for notifications
    fetch(`${API_URL}/reports/low-stock`)
      .then(r => r.json())
      .then(j => setLowStockItems(j.data?.lowStock || []))
      .catch(() => {});

    // Live clock
    const tick = () => {
      setCurrentTime(new Date().toLocaleString('id-ID', {
        weekday: 'short', day: '2-digit', month: 'short',
        hour: '2-digit', minute: '2-digit'
      }));
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  const notifCount = lowStockItems.length;

  return (
    <header className="h-14 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-5 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <p className="text-xs text-neutral-600 hidden sm:block">{currentTime}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Notifikasi</span>
                <button onClick={() => setShowNotif(false)} className="text-neutral-600 hover:text-white text-xs">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifCount === 0 ? (
                  <div className="p-6 flex flex-col items-center justify-center text-center text-neutral-600 text-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                    Tidak ada notifikasi aktif
                  </div>
                ) : (
                  <div>
                    <div className="px-4 py-2 bg-amber-500/5 border-b border-white/5 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <p className="text-xs font-semibold text-amber-400">Peringatan Stok Rendah ({notifCount})</p>
                    </div>
                    {lowStockItems.slice(0, 8).map(item => (
                      <Link key={item.id} href="/inventory/stock" onClick={() => setShowNotif(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                          <p className="text-xs text-neutral-600">Kategori: {item.category?.name || '-'}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${item.stock === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {item.stock === 0 ? 'HABIS' : `SISA ${item.stock}`}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {notifCount > 0 && (
                <div className="p-3 border-t border-white/5">
                  <Link href="/inventory/stock" onClick={() => setShowNotif(false)}
                    className="block text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    Kelola Stok →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings shortcut */}
        <Link href="/settings/store"
          className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">Administrator</p>
            <p className="text-[10px] text-neutral-600">admin@cashmate.com</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            A
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showNotif && <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />}
    </header>
  );
}
