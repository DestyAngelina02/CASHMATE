'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const FILTERS = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Tahun Ini', value: 'year' },
];

export default function SalesAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('week');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/reports/sales?period=${filter}`)
      .then(r => r.json())
      .then(j => setData(j.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const dailyData = data?.dailyData || [];
  const maxRev = Math.max(...dailyData.map(d => Number(d.revenue || 0)), 1);
  const totalRev = dailyData.reduce((s, d) => s + Number(d.revenue || 0), 0);
  const totalTrx = dailyData.reduce((s, d) => s + (d.transactions || 0), 0);
  const avgOrder = totalTrx > 0 ? totalRev / totalTrx : 0;

  const kpis = [
    { label: 'Total Pendapatan', value: `Rp ${totalRev.toLocaleString('id-ID')}`, icon: '💰', color: 'text-emerald-400', bg: 'border-emerald-500/20' },
    { label: 'Total Transaksi', value: totalTrx, icon: '🧾', color: 'text-blue-400', bg: 'border-blue-500/20' },
    { label: 'Rata-rata Nilai Pesanan', value: `Rp ${Math.round(avgOrder).toLocaleString('id-ID')}`, icon: '📊', color: 'text-violet-400', bg: 'border-violet-500/20' },
    { label: 'Data Recentu', value: data?.recentTransactions?.length || 0, icon: '📋', color: 'text-amber-400', bg: 'border-amber-500/20' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Analytics</h1>
          <p className="text-neutral-500 text-sm mt-1">Analisis tren penjualan dan performa bisnis.</p>
        </div>
        <div className="flex gap-1.5 p-1 bg-neutral-900 rounded-xl border border-white/5">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.value ? 'bg-emerald-500 text-neutral-950' : 'text-neutral-500 hover:text-white'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className={`p-5 rounded-2xl border ${k.bg} bg-neutral-900/40`}>
            <span className="text-2xl">{k.icon}</span>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-3">{k.label}</p>
            {loading ? <div className="h-7 bg-white/5 rounded-lg animate-pulse mt-1 w-3/4" /> : <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>}
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart */}
      <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 mb-6">
        <h2 className="text-base font-semibold text-white mb-6">Grafik Pendapatan</h2>
        {loading ? (
          <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
        ) : dailyData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-neutral-600">Tidak ada data untuk periode ini.</div>
        ) : (
          <>
            <div className="flex items-end gap-1.5 h-48">
              {dailyData.map((day, i) => {
                const h = (Number(day.revenue || 0) / maxRev) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white whitespace-nowrap shadow-2xl z-10 pointer-events-none">
                      <div className="font-semibold text-neutral-300">{day.date}</div>
                      <div className="text-emerald-400 font-bold">Rp {Number(day.revenue || 0).toLocaleString('id-ID')}</div>
                      <div className="text-neutral-500">{day.transactions || 0} transaksi</div>
                    </div>
                    <div className={`w-full rounded-t-lg transition-all cursor-default ${h > 0 ? 'bg-gradient-to-t from-emerald-700/50 to-emerald-500/80 hover:from-emerald-600/60 hover:to-emerald-400' : 'bg-white/5'}`}
                      style={{ height: `${Math.max(h, 2)}%` }} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-neutral-600">
              {dailyData.map((d, i) => (
                <span key={i} className="flex-1 text-center truncate px-0.5">{(d.date || '').split(' ')[0]}</span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40">
        <h2 className="text-base font-semibold text-white mb-4">Transaksi Terbaru</h2>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)
          ) : !data?.recentTransactions?.length ? (
            <p className="text-neutral-600 text-sm">Belum ada transaksi.</p>
          ) : data.recentTransactions.slice(0, 8).map(t => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <div>
                  <p className="text-sm font-medium text-white font-mono">{t.invoiceNo}</p>
                  <p className="text-xs text-neutral-600">{new Date(t.createdAt).toLocaleString('id-ID')} · {t.paymentMethod}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-emerald-400">Rp {Number(t.grandTotal).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
