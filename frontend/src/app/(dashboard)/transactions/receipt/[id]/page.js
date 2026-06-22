'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReceiptPage({ params }) {
  // Gunakan React.use() untuk unwrap params sesuai standar Next.js 14+ / App Router
  const { id } = use(params);
  const router = useRouter();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`${API_URL}/transactions/${id}`);
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.message || 'Transaksi tidak ditemukan');
        
        setTransaction(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Auto print ketika data selesai dimuat
  useEffect(() => {
    if (transaction && !loading) {
      // Tunggu render selesai sebentar, lalu print
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transaction, loading]);

  if (loading) return <div className="p-10 text-center text-white">Memuat struk...</div>;
  if (error) return <div className="p-10 text-center text-rose-500">{error}</div>;
  if (!transaction) return <div className="p-10 text-center text-white">Transaksi tidak valid</div>;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-10 print:py-0 print:bg-white">
      
      {/* Area Struk (Untuk Layar dan Print) */}
      <div className="w-[80mm] bg-white text-black p-4 font-mono text-sm print:shadow-none print:m-0 shadow-xl mx-auto">
        
        {/* Header Toko */}
        <div className="text-center mb-4">
          <h1 className="font-bold text-xl">CASHMATE STORE</h1>
          <p className="text-xs">Jl. Teknologi No. 123, Jakarta</p>
          <p className="text-xs">Telp: 0812-3456-7890</p>
        </div>
        
        <div className="border-b border-dashed border-black mb-3"></div>
        
        {/* Info Transaksi */}
        <div className="mb-3 text-xs">
          <div className="flex justify-between">
            <span>No:</span>
            <span>{transaction.invoiceNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Tgl:</span>
            <span>{new Date(transaction.createdAt).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{transaction.user?.name || 'Admin'}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-black mb-3"></div>
        
        {/* Daftar Item */}
        <div className="mb-3">
          {transaction.items.map(item => (
            <div key={item.id} className="mb-2">
              <div className="font-bold">{item.product?.name || 'Item'}</div>
              <div className="flex justify-between text-xs">
                <span>{item.quantity} x Rp {Number(item.unitPrice).toLocaleString('id-ID')}</span>
                <span>Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-b border-dashed border-black mb-3"></div>

        {/* Total & Pembayaran */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>Rp {Number(transaction.grandTotal).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>TUNAI</span>
            <span>Rp {Number(transaction.paidAmount).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>KEMBALI</span>
            <span>Rp {Number(transaction.changeAmount).toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-black mb-4"></div>

        {/* Footer */}
        <div className="text-center text-xs">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p className="mt-1">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
        </div>
      </div>

      {/* Tombol Navigasi (Disembunyikan saat print) */}
      <div className="mt-8 flex gap-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          🖨️ Cetak Ulang
        </button>
        <button 
          onClick={() => router.push('/transactions')}
          className="px-6 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          Kembali ke Kasir
        </button>
      </div>

    </div>
  );
}
