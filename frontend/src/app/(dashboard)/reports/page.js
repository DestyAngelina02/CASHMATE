'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sales');
  const [salesData, setSalesData] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [resSales, resStock] = await Promise.all([
        fetch(`${API_URL}/reports/sales`),
        fetch(`${API_URL}/reports/low-stock`)
      ]);
      const jsonSales = await resSales.json();
      const jsonStock = await resStock.json();
      if (!resSales.ok) throw new Error(jsonSales.message || 'Gagal mengambil laporan penjualan');
      setSalesData(jsonSales.data);
      setLowStock(jsonStock.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = salesData?.dailyData
    ? Math.max(...salesData.dailyData.map(d => Number(d.revenue)), 1)
    : 1;

  const tabClass = (tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
      activeTab === tab
        ? 'bg-emerald-500 text-neutral-950'
        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
    }`;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Laporan</h1>
        <p className="text-neutral-400 mt-1 text-sm">Analitik penjualan dan pantauan stok produk.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}
      {salesData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-neutral-900/50">
            <p className="text-xs text-neutral-400 mb-1">Total Transaksi</p>
            <p className="text-3xl font-bold text-white">{salesData.summary.totalTransactions}</p>
          </div>
          <div className="p-5 rounded-2xl border border-teal-500/20 bg-neutral-900/50">
            <p className="text-xs text-neutral-400 mb-1">Total Pendapatan</p>
            <p className="text-2xl font-bold text-emerald-400">Rp {Number(salesData.summary.totalRevenue).toLocaleString('id-ID')}</p>
          </div>
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-neutral-900/50">
            <p className="text-xs text-neutral-400 mb-1">Produk Stok Menipis</p>
            <p className="text-3xl font-bold text-amber-400">{lowStock.length}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-neutral-900/50 rounded-xl border border-neutral-900 w-fit">
        <button onClick={() => setActiveTab('sales')} className={tabClass('sales')}>📋 Riwayat Transaksi</button>
        <button onClick={() => setActiveTab('chart')} className={tabClass('chart')}>📈 Grafik 7 Hari</button>
        <button onClick={() => setActiveTab('stock')} className={tabClass('stock')}>⚠️ Stok Menipis</button>
      </div>

      {/* TAB: Riwayat Transaksi */}
      {activeTab === 'sales' && (
        <div className="rounded-2xl border border-neutral-900 bg-neutral-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-900">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">No. Invoice</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kasir</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Items</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tanggal</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-neutral-900/50">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : !salesData?.recentTransactions?.length ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-sm">Belum ada transaksi.</td>
                  </tr>
                ) : (
                  salesData.recentTransactions.map((trx) => (
                    <tr key={trx.id} className="border-b border-neutral-900/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-emerald-400">{trx.invoiceNo}</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">{trx.user?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{trx._count?.items || 0} item</td>
                      <td className="px-6 py-4 text-sm font-bold text-white">Rp {Number(trx.grandTotal).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        {new Date(trx.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(`/transactions/receipt/${trx.id}`)}
                          className="text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-500/10"
                        >
                          Lihat Struk
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Grafik 7 Hari */}
      {activeTab === 'chart' && (
        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50">
          <h2 className="text-base font-semibold text-white mb-1">Pendapatan 7 Hari Terakhir</h2>
          <p className="text-xs text-neutral-500 mb-8">Data diambil secara real-time dari transaksi yang telah diproses.</p>

          {loading ? (
            <div className="flex items-end gap-3 h-48">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 bg-neutral-800 animate-pulse rounded-t-lg" style={{ height: `${Math.random() * 100}%` }} />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-end gap-3 h-48">
                {salesData?.dailyData?.map((day, i) => {
                  const heightPct = maxRevenue > 0 ? (Number(day.revenue) / maxRevenue) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl z-10">
                        <div className="font-semibold">{day.date}</div>
                        <div className="text-emerald-400">Rp {Number(day.revenue).toLocaleString('id-ID')}</div>
                        <div className="text-neutral-400">{day.count} transaksi</div>
                      </div>
                      <div
                        className={`w-full rounded-t-lg transition-all ${heightPct > 0 ? 'bg-gradient-to-t from-emerald-600/60 to-emerald-400/80 hover:from-emerald-500/70 hover:to-emerald-300/90' : 'bg-neutral-800'}`}
                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3">
                {salesData?.dailyData?.map((day, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-neutral-500">{day.date.split(' ')[0]}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB: Stok Menipis */}
      {activeTab === 'stock' && (
        <div className="rounded-2xl border border-neutral-900 bg-neutral-900/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-900 flex items-center gap-2">
            <span className="text-amber-400">⚠️</span>
            <span className="text-sm text-neutral-300">Produk dengan stok ≤ 10 unit</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-900">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Produk</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Harga</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stok</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-neutral-900/50">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : lowStock.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-neutral-500 text-sm">Semua produk memiliki stok yang cukup.</div>
                    </td>
                  </tr>
                ) : (
                  lowStock.map((prod) => (
                    <tr key={prod.id} className="border-b border-neutral-900/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{prod.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{prod.category?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{prod.supplier?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400">Rp {Number(prod.price).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          prod.stock === 0
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {prod.stock === 0 ? 'HABIS' : `${prod.stock} unit`}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
