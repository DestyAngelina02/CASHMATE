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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/stats`);
        if (!res.ok) throw new Error('Gagal mengambil data statistik.');
        const json = await res.json();
        setStats(json.data);
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

      {/* Placeholder Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50">
          <h2 className="text-base font-semibold text-white mb-1">Tren Penjualan</h2>
          <p className="text-xs text-neutral-500 mb-6">Grafik akan tersedia saat data transaksi mulai masuk.</p>
          <div className="flex items-end gap-2 h-40">
            {[30, 55, 40, 70, 60, 85, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-600/30 to-emerald-500/60 transition-all hover:from-emerald-600/50 hover:to-emerald-400/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-600">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50">
          <h2 className="text-base font-semibold text-white mb-1">Aktivitas Terkini</h2>
          <p className="text-xs text-neutral-500 mb-6">Log transaksi & stok akan muncul di sini.</p>
          <div className="space-y-3">
            {['Sistem diinisialisasi', 'Admin login pertama', 'Data kategori di-seed', 'Database terhubung', 'API aktif di port 5000'].map((act, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-sm text-neutral-400">{act}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
