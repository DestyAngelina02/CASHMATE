'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const StatCard = ({ label, value, icon, color, loading }) => (
  <div className={`p-6 rounded-2xl border bg-neutral-900/50 backdrop-blur-sm ${color} transition-all hover:scale-[1.02] group`}>
    <div className="flex items-start justify-between mb-4">
      <span className="text-3xl">{icon}</span>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color.replace('border-', 'bg-').replace('/20', '/10')} opacity-80`}>
        Live
      </span>
    </div>
    <p className="text-sm font-medium text-neutral-400 mb-1">{label}</p>
    {loading ? (
      <div className="h-9 w-24 bg-neutral-800 rounded-lg animate-pulse" />
    ) : (
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    )}
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resStats, resSales] = await Promise.all([
          fetch(`${API_URL}/dashboard/stats`),
          fetch(`${API_URL}/reports/sales`)
        ]);
        if (!resStats.ok) throw new Error('Gagal mengambil data statistik.');
        const jsonStats = await resStats.json();
        const jsonSales = await resSales.json();
        setStats(jsonStats.data);
        if (resSales.ok) setSalesData(jsonSales.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total Produk',
      value: stats?.totalProducts ?? 0,
      icon: '📦',
      color: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
    {
      label: 'Total Pengguna',
      value: stats?.totalUsers ?? 0,
      icon: '👥',
      color: 'border-teal-500/20 hover:border-teal-500/40',
    },
    {
      label: 'Total Pelanggan',
      value: stats?.totalCustomers ?? 0,
      icon: '🧑‍🤝‍🧑',
      color: 'border-cyan-500/20 hover:border-cyan-500/40',
    },
    {
      label: 'Total Transaksi',
      value: stats?.totalTransactions ?? 0,
      icon: '🧾',
      color: 'border-violet-500/20 hover:border-violet-500/40',
    },
    {
      label: 'Total Pendapatan',
      value: `Rp ${Number(stats?.totalRevenue ?? 0).toLocaleString('id-ID')}`,
      icon: '💰',
      color: 'border-amber-500/20 hover:border-amber-500/40',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-1 text-sm">Ringkasan statistik dan performa bisnis Anda secara real-time.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          ⚠️ {error} &mdash; Pastikan backend berjalan di port 5000.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      {/* Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50">
          <h2 className="text-base font-semibold text-white mb-1">Tren Penjualan (7 Hari)</h2>
          <p className="text-xs text-neutral-500 mb-6">Grafik pendapatan berdasarkan data transaksi.</p>
          
          {loading ? (
             <div className="flex items-end gap-2 h-40">
               {Array.from({ length: 7 }).map((_, i) => (
                 <div key={i} className="flex-1 bg-neutral-800 animate-pulse rounded-t-md" style={{ height: `${Math.random() * 100}%` }} />
               ))}
             </div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-40">
                {salesData?.dailyData?.map((day, i) => {
                  const maxRev = Math.max(...salesData.dailyData.map(d => Number(d.revenue)), 1);
                  const h = (Number(day.revenue) / maxRev) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                       {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl z-10">
                        <div className="font-semibold">{day.date}</div>
                        <div className="text-emerald-400">Rp {Number(day.revenue).toLocaleString('id-ID')}</div>
                      </div>
                      <div
                        className={`w-full rounded-t-md transition-all ${h > 0 ? 'bg-gradient-to-t from-emerald-600/30 to-emerald-500/60 hover:from-emerald-600/50 hover:to-emerald-400/80' : 'bg-neutral-800/50'}`}
                        style={{ height: `${Math.max(h, 2)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-neutral-600">
                {salesData?.dailyData?.map(d => (
                  <span key={d.date} className="flex-1 text-center truncate px-1">{d.date.split(' ')[0]}</span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50 overflow-hidden flex flex-col">
          <h2 className="text-base font-semibold text-white mb-1">Transaksi Terkini</h2>
          <p className="text-xs text-neutral-500 mb-6">Log aktivitas kasir.</p>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-neutral-800 shrink-0" /><div className="h-4 bg-neutral-800 rounded w-full animate-pulse" /></div>
              ))
            ) : !salesData?.recentTransactions?.length ? (
               <p className="text-sm text-neutral-500 text-center mt-4">Belum ada transaksi.</p>
            ) : (
              salesData.recentTransactions.slice(0, 7).map((trx) => (
                <div key={trx.id} className="flex justify-between items-start border-b border-neutral-900/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div>
                      <p className="text-sm font-medium text-white">{trx.invoiceNo}</p>
                      <p className="text-xs text-neutral-500">{new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Kasir: {trx.user?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">Rp {Number(trx.grandTotal).toLocaleString('id-ID')}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
