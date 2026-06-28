'use client';

import { useState, useEffect } from 'react';
import { Banknote, Smartphone, CreditCard, Landmark } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getMethodIcon = (method, className) => {
  const icons = {
    CASH: <Banknote className={className} />,
    QRIS: <Smartphone className={className} />,
    TRANSFER: <Landmark className={className} />,
  };
  return icons[method] || <CreditCard className={className} />;
};

export default function PaymentHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/transactions`)
      .then(r => r.json())
      .then(j => setTransactions(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totals = transactions.reduce((acc, t) => {
    const m = t.paymentMethod || 'OTHER';
    acc[m] = (acc[m] || 0) + Number(t.grandTotal);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Riwayat Pembayaran</h1>
        <p className="text-neutral-500 text-sm mt-1">Ringkasan total penerimaan per metode pembayaran.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(totals).map(([method, total]) => (
          <div key={method} className="p-5 rounded-2xl border border-white/5 bg-neutral-900/40">
            {getMethodIcon(method, "w-6 h-6 text-neutral-400")}
            <p className="text-xs font-semibold text-neutral-500 mt-3 uppercase tracking-wider">{method}</p>
            <p className="text-xl font-bold text-white mt-1">Rp {total.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
            <tr>
              <th className="px-5 py-3.5">Invoice</th>
              <th className="px-5 py-3.5">Metode</th>
              <th className="px-5 py-3.5">Total Bayar</th>
              <th className="px-5 py-3.5">Kembalian</th>
              <th className="px-5 py-3.5">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
              ))
            ) : transactions.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-600">Belum ada data.</td></tr>
            ) : transactions.map(t => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-white">{t.invoiceNo}</td>
                <td className="px-5 py-3.5 text-neutral-400 flex items-center gap-2">
                  {getMethodIcon(t.paymentMethod, "w-4 h-4")} {t.paymentMethod}
                </td>
                <td className="px-5 py-3.5 font-bold text-emerald-400">Rp {Number(t.paidAmount || t.grandTotal).toLocaleString('id-ID')}</td>
                <td className="px-5 py-3.5 text-neutral-400">Rp {Number(t.changeAmount || 0).toLocaleString('id-ID')}</td>
                <td className="px-5 py-3.5 text-neutral-500 text-xs">{new Date(t.createdAt).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
