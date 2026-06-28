'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReceiptPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`${API_URL}/transactions/${id}`).then(r => r.json()),
      fetch(`${API_URL}/settings`).then(r => r.json()),
    ]).then(([txData, settingsData]) => {
      if (txData.status === 'success') setTransaction(txData.data);
      else setError('Transaksi tidak ditemukan.');
      if (settingsData.data) setSettings(settingsData.data);
    }).catch(() => setError('Gagal memuat data struk.'))
    .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <p className="text-rose-400">{error}</p>
      <Link href="/sales/transactions" className="text-sm text-teal-500 hover:text-teal-400">
        ← Kembali ke Daftar Transaksi
      </Link>
    </div>
  );

  if (!transaction) return null;

  const storeName = settings?.storeName || 'CASHMATE STORE';
  const storeAddress = settings?.address || '';
  const storePhone = settings?.phone || '';
  const receiptNote = settings?.receiptNote || 'Terima kasih telah berbelanja!';
  const txDate = new Date(transaction.createdAt).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div>
      {/* Toolbar - hanya tampil di layar, tidak saat cetak */}
      <div className="print:hidden flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/sales/transactions" className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Struk Transaksi</h1>
            <p className="text-neutral-500 text-sm font-mono">{transaction.invoiceNo}</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl transition-all text-sm"
        >
          <Printer className="w-4 h-4" />
          Cetak Struk
        </button>
      </div>

      {/* Status Badge */}
      <div className="print:hidden flex items-center gap-2 mb-6 text-emerald-400 text-sm font-medium">
        <CheckCircle2 className="w-5 h-5" />
        Transaksi berhasil diproses
      </div>

      {/* Receipt Preview */}
      <div className="flex justify-center">
        <div id="receipt" className="bg-white text-black font-mono text-xs w-full max-w-sm rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-full">
          {/* Header */}
          <div className="bg-neutral-950 text-white text-center py-6 px-4 print:bg-white print:text-black">
            <h2 className="text-lg font-bold tracking-wide uppercase">{storeName}</h2>
            {storeAddress && <p className="text-neutral-400 print:text-neutral-600 text-xs mt-1">{storeAddress}</p>}
            {storePhone && <p className="text-neutral-400 print:text-neutral-600 text-xs">{storePhone}</p>}
          </div>

          <div className="p-5">
            {/* Invoice Info */}
            <div className="border-t border-b border-dashed border-neutral-300 py-2 mb-4 space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">No. Invoice</span>
                <span className="font-bold text-right">{transaction.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tanggal</span>
                <span className="text-right">{txDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Kasir</span>
                <span className="text-right">{transaction.user?.name || '-'}</span>
              </div>
              {transaction.customer && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pelanggan</span>
                  <span className="text-right">{transaction.customer.name}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {transaction.items?.map((item, index) => (
                <div key={index}>
                  <div className="font-medium truncate">{item.product?.name || 'Produk'}</div>
                  <div className="flex justify-between text-neutral-500">
                    <span>{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</span>
                    <span className="font-medium text-black">Rp {Number(item.total).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1 mb-4">
              {Number(transaction.discount) > 0 && (
                <div className="flex justify-between text-neutral-500">
                  <span>Diskon</span>
                  <span>- Rp {Number(transaction.discount).toLocaleString('id-ID')}</span>
                </div>
              )}
              {Number(transaction.tax) > 0 && (
                <div className="flex justify-between text-neutral-500">
                  <span>Pajak</span>
                  <span>Rp {Number(transaction.tax).toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm border-t border-neutral-300 pt-2 mt-2">
                <span>TOTAL</span>
                <span>Rp {Number(transaction.grandTotal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dibayar ({transaction.paymentMethod})</span>
                <span>Rp {Number(transaction.paidAmount).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Kembalian</span>
                <span>Rp {Number(transaction.changeAmount).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-dashed border-neutral-300 pt-4 text-center text-neutral-500 text-xs leading-relaxed whitespace-pre-wrap">
              {receiptNote}
            </div>

            <div className="text-center mt-4 text-neutral-400 text-[10px]">
              Powered by CASHMATE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
