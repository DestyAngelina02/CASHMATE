'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/transactions`)
      .then(r => r.json())
      .then(j => setTransactions(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(t => {
    const matchSearch = t.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchMethod = filterMethod === 'all' || t.paymentMethod === filterMethod;
    return matchSearch && matchMethod;
  });

  const methodColor = (m) => ({
    CASH: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    QRIS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    DANA: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    OVO: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    GOPAY: 'bg-green-500/10 text-green-400 border-green-500/20',
    SHOPEEPAY: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    TRANSFER: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  }[m] || 'bg-neutral-800 text-neutral-400');

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Riwayat Transaksi</h1>
          <p className="text-neutral-500 text-sm mt-1">Semua transaksi penjualan yang telah diproses.</p>
        </div>
        <Link href="/sales/pos" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-lg transition-all text-sm">
          + Transaksi Baru (POS)
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Cari invoice atau kasir..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-neutral-200 focus:outline-none focus:border-emerald-500/50 text-sm transition-colors" />
        <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-neutral-200 focus:outline-none focus:border-emerald-500/50 text-sm">
          <option value="all">Semua Metode</option>
          <option value="CASH">Cash</option>
          <option value="QRIS">QRIS</option>
          <option value="DANA">Dana</option>
          <option value="OVO">OVO</option>
          <option value="GOPAY">GoPay</option>
          <option value="SHOPEEPAY">ShopeePay</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </div>

      <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
            <tr>
              <th className="px-5 py-3.5">Invoice</th>
              <th className="px-5 py-3.5">Kasir</th>
              <th className="px-5 py-3.5">Metode</th>
              <th className="px-5 py-3.5">Total</th>
              <th className="px-5 py-3.5">Waktu</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-600">Belum ada data transaksi.</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-white font-medium">{t.invoiceNo}</td>
                <td className="px-5 py-3.5 text-neutral-400">{t.user?.name || '-'}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${methodColor(t.paymentMethod)}`}>{t.paymentMethod}</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-emerald-400">Rp {Number(t.grandTotal).toLocaleString('id-ID')}</td>
                <td className="px-5 py-3.5 text-neutral-500 text-xs">{new Date(t.createdAt).toLocaleString('id-ID')}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/transactions/receipt/${t.id}`} className="text-xs text-teal-500 hover:text-teal-400 font-medium">Struk →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
