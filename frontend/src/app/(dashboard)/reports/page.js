'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Printer, BarChart3, Package, Banknote, Receipt, AlertTriangle, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const PERIODS = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Tahun Ini', value: 'year' },
];

export default function ReportsPage() {
  const [salesData, setSalesData] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('sales');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/reports/sales?period=${period}`).then(r => r.json()),
      fetch(`${API_URL}/reports/low-stock`).then(r => r.json()),
    ]).then(([s, ls]) => {
      setSalesData(s.data);
      setLowStock(ls.data?.lowStock || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [period]);

  const exportCSV = () => {
    if (!salesData?.recentTransactions?.length) return;
    const headers = ['Invoice', 'Kasir', 'Metode', 'Total', 'Waktu'];
    const rows = salesData.recentTransactions.map(t => [
      t.invoiceNo, t.user?.name || '-', t.paymentMethod,
      Number(t.grandTotal).toLocaleString('id-ID'),
      new Date(t.createdAt).toLocaleString('id-ID')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `cashmate-report-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPrint = () => window.print();

  const dailyData = salesData?.dailyData || [];
  const totalRev = dailyData.reduce((s, d) => s + Number(d.revenue || 0), 0);
  const totalTrx = dailyData.reduce((s, d) => s + (d.transactions || 0), 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Pusat Laporan</h1>
          <p className="text-neutral-500 text-sm mt-1">Lihat, filter, dan ekspor laporan bisnis.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-neutral-300 hover:text-white font-medium rounded-lg text-sm transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={exportPrint} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-neutral-300 hover:text-white font-medium rounded-lg text-sm transition-all">
            <Printer className="w-4 h-4" /> Cetak
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-900 rounded-xl border border-white/5 mb-6 w-fit">
        {[{ v: 'sales', l: 'Penjualan', icon: <BarChart3 className="w-4 h-4" /> }, { v: 'inventory', l: 'Inventaris', icon: <Package className="w-4 h-4" /> }].map(t => (
          <button key={t.v} onClick={() => setActiveTab(t.v)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.v ? 'bg-emerald-500 text-neutral-950' : 'text-neutral-500 hover:text-white'}`}>
            {t.icon} {t.l}
          </button>
        ))}
      </div>

      {activeTab === 'sales' && (
        <div>
          {/* Period Filter */}
          <div className="flex gap-1.5 mb-6">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${period === p.value ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-neutral-500 hover:text-white hover:border-white/10'}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Pendapatan', value: `Rp ${totalRev.toLocaleString('id-ID')}`, icon: <Banknote className="w-6 h-6 text-emerald-400" />, color: 'text-emerald-400' },
              { label: 'Total Transaksi', value: totalTrx, icon: <Receipt className="w-6 h-6 text-blue-400" />, color: 'text-blue-400' },
              { label: 'Rata-rata/Transaksi', value: `Rp ${totalTrx > 0 ? Math.round(totalRev / totalTrx).toLocaleString('id-ID') : 0}`, icon: <BarChart3 className="w-6 h-6 text-violet-400" />, color: 'text-violet-400' },
              { label: 'Produk Terjual', value: salesData?.recentTransactions?.reduce((s, t) => s + (t.items?.length || 0), 0) || 0, icon: <Package className="w-6 h-6 text-amber-400" />, color: 'text-amber-400' },
            ].map(k => (
              <div key={k.label} className="p-4 rounded-2xl border border-white/5 bg-neutral-900/40">
                <span className="text-xl">{k.icon}</span>
                <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider mt-3">{k.label}</p>
                {loading ? <div className="h-6 bg-white/5 rounded animate-pulse mt-1 w-3/4" />
                  : <p className={`text-lg font-bold mt-1 ${k.color}`}>{k.value}</p>}
              </div>
            ))}
          </div>

          {/* Transaction Table */}
          <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden print:shadow-none">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Detail Transaksi</h2>
              <span className="text-xs text-neutral-600">{salesData?.recentTransactions?.length || 0} transaksi</span>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
                <tr>
                  <th className="px-5 py-3.5 text-left">Invoice</th>
                  <th className="px-5 py-3.5 text-left">Kasir</th>
                  <th className="px-5 py-3.5 text-left">Metode</th>
                  <th className="px-5 py-3.5 text-left">Total</th>
                  <th className="px-5 py-3.5 text-left">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
                  ))
                ) : !salesData?.recentTransactions?.length ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-600">Belum ada transaksi untuk periode ini.</td></tr>
                ) : salesData.recentTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-white">{t.invoiceNo}</td>
                    <td className="px-5 py-3.5 text-neutral-400">{t.user?.name || '-'}</td>
                    <td className="px-5 py-3.5 text-neutral-400 text-xs">{t.paymentMethod}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-400">Rp {Number(t.grandTotal).toLocaleString('id-ID')}</td>
                    <td className="px-5 py-3.5 text-neutral-600 text-xs">{new Date(t.createdAt).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Laporan Stok Kritis
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
                <tr>
                  <th className="px-5 py-3.5 text-left">Produk</th>
                  <th className="px-5 py-3.5 text-left">Kategori</th>
                  <th className="px-5 py-3.5 text-left">Stok Tersisa</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-neutral-600">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                        Semua stok dalam kondisi aman!
                      </div>
                    </td>
                  </tr>
                ) : lowStock.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">{p.name}</td>
                    <td className="px-5 py-3.5 text-neutral-500">{p.category?.name || '-'}</td>
                    <td className="px-5 py-3.5 font-bold text-white">{p.stock}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${p.stock === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {p.stock === 0 ? 'HABIS' : 'RENDAH'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href="/inventory/stock" className="text-xs text-teal-500 hover:text-teal-400">Restock →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
