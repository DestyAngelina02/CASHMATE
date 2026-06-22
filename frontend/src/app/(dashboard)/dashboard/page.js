'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const FILTERS = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu', value: 'week' },
  { label: 'Bulan', value: 'month' },
  { label: 'Tahun', value: 'year' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/dashboard/stats`).then(r => r.json()),
      fetch(`${API_URL}/reports/sales?period=${period}`).then(r => r.json()),
    ]).then(([s, d]) => {
      setStats(s.data);
      setSalesData(d.data);
    }).catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, [period]);

  const dailyData = salesData?.dailyData || [];
  const maxRev = Math.max(...dailyData.map(d => Number(d.revenue || 0)), 1);
  const totalRevPeriod = dailyData.reduce((s, d) => s + Number(d.revenue || 0), 0);

  const kpis = [
    { label: 'Total Produk', value: stats?.totalProducts ?? 0, icon: '📦', color: 'border-emerald-500/20', text: 'text-emerald-400', href: '/inventory/products' },
    { label: 'Total Pengguna', value: stats?.totalUsers ?? 0, icon: '🔐', color: 'border-teal-500/20', text: 'text-teal-400', href: '/users' },
    { label: 'Total Pelanggan', value: stats?.totalCustomers ?? 0, icon: '👥', color: 'border-cyan-500/20', text: 'text-cyan-400', href: '/customers' },
    { label: 'Total Transaksi', value: stats?.totalTransactions ?? 0, icon: '🧾', color: 'border-violet-500/20', text: 'text-violet-400', href: '/sales/transactions' },
    { label: 'Total Pendapatan', value: `Rp ${Number(stats?.totalRevenue ?? 0).toLocaleString('id-ID')}`, icon: '💰', color: 'border-amber-500/20', text: 'text-amber-400', href: '/analytics/sales' },
    { label: `Pendapatan (${FILTERS.find(f=>f.value===period)?.label})`, value: `Rp ${totalRevPeriod.toLocaleString('id-ID')}`, icon: '📈', color: 'border-rose-500/20', text: 'text-rose-400', href: '/analytics/sales' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">Live</span>
        </div>
        <p className="text-neutral-500 text-sm">Ringkasan performa bisnis Cashmate secara real-time.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          ⚠️ {error} — Pastikan MySQL dan backend aktif di port 5000.
        </div>
      )}

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis.map(k => (
          <Link key={k.label} href={k.href} className={`p-4 rounded-2xl border ${k.color} bg-neutral-900/40 hover:bg-neutral-800/50 transition-all group cursor-pointer`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
              <svg className="w-3.5 h-3.5 text-neutral-700 group-hover:text-neutral-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
            <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider line-clamp-1">{k.label}</p>
            {loading ? <div className="h-6 bg-white/5 rounded animate-pulse mt-1 w-3/4" />
              : <p className={`text-lg font-bold mt-1 ${k.text} truncate`}>{k.value}</p>}
          </Link>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-neutral-900/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Tren Pendapatan</h2>
              <p className="text-xs text-neutral-600 mt-0.5">Hover bar untuk detail transaksi</p>
            </div>
            <div className="flex gap-1 p-1 bg-neutral-950 rounded-lg border border-white/5">
              {FILTERS.map(f => (
                <button key={f.value} onClick={() => setPeriod(f.value)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === f.value ? 'bg-emerald-500 text-neutral-950' : 'text-neutral-600 hover:text-white'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-44 bg-white/5 rounded-xl animate-pulse" />
          ) : dailyData.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-neutral-700 text-sm">Tidak ada data untuk periode ini.</div>
          ) : (
            <>
              <div className="flex items-end gap-1.5 h-44">
                {dailyData.map((day, i) => {
                  const h = (Number(day.revenue || 0) / maxRev) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                        <div className="bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white whitespace-nowrap shadow-2xl">
                          <div className="font-semibold text-neutral-400">{day.date}</div>
                          <div className="text-emerald-400 font-bold">Rp {Number(day.revenue || 0).toLocaleString('id-ID')}</div>
                          <div className="text-neutral-500">{day.transactions || 0} transaksi</div>
                        </div>
                        <div className="w-2 h-2 bg-neutral-800 border-b border-r border-white/10 rotate-45 -mt-1" />
                      </div>
                      <div className={`w-full rounded-t-lg transition-all ${h > 0 ? 'bg-gradient-to-t from-emerald-700/40 to-emerald-500/70 hover:from-emerald-600/50 hover:to-emerald-400/90' : 'bg-white/5'}`}
                        style={{ height: `${Math.max(h, 2)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                {dailyData.map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[9px] text-neutral-700 truncate px-0.5">{(d.date || '').split(' ')[0]}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Transaksi Terkini</h2>
            <Link href="/sales/transactions" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">Lihat Semua →</Link>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)
            ) : !salesData?.recentTransactions?.length ? (
              <p className="text-sm text-neutral-700 text-center mt-6">Belum ada transaksi.</p>
            ) : salesData.recentTransactions.slice(0, 8).map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-white font-mono">{t.invoiceNo}</p>
                    <p className="text-[10px] text-neutral-700">{new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-emerald-400">Rp {Number(t.grandTotal).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
          <Link href="/sales/pos" className="mt-5 block text-center py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all">
            + Transaksi Baru (POS)
          </Link>
        </div>
      </div>
    </div>
  );
}
