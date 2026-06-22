'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReceiptSettingsPage() {
  const [settings, setSettings] = useState({ storeName: '', phone: '', address: '', receiptNote: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const json = await res.json();
      if (json.data) setSettings(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage('Format struk berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Gagal menyimpan format struk.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-neutral-400">Memuat pengaturan...</div>;

  return (
    <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Pengaturan Struk Kasir</h1>
          <p className="text-neutral-400 mt-1 text-sm">Sesuaikan tampilan struk yang akan dicetak untuk pelanggan.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('Gagal') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Pesan Penutup (Footer)</label>
              <textarea 
                value={settings.receiptNote || ''} 
                onChange={e => setSettings({...settings, receiptNote: e.target.value})} 
                rows={4} 
                placeholder="Contoh: Terima kasih telah berbelanja! Barang yang sudah dibeli tidak dapat ditukar."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              />
              <p className="text-xs text-neutral-500 mt-2">Pesan ini akan dicetak di bagian paling bawah struk transaksi.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Format Struk'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div>
        <div className="sticky top-24">
          <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Preview Struk</h2>
          <div className="bg-white text-black p-6 rounded-sm shadow-xl w-full max-w-sm mx-auto font-mono text-xs">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">{settings.storeName || 'NAMA TOKO'}</h3>
              <p>{settings.address || 'Alamat Toko'}</p>
              <p>{settings.phone || 'No. Telp'}</p>
            </div>
            
            <div className="border-t border-b border-dashed border-neutral-300 py-2 mb-2 flex justify-between">
              <span>TRX-123456</span>
              <span>12/12/2026 14:30</span>
            </div>

            <div className="space-y-1 mb-2">
              <div className="flex justify-between">
                <span>Produk Contoh A</span>
                <span>Rp 50.000</span>
              </div>
              <div className="text-neutral-500">2 x Rp 25.000</div>
            </div>

            <div className="border-t border-dashed border-neutral-300 pt-2 mb-4">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>Rp 50.000</span>
              </div>
            </div>

            <div className="text-center text-neutral-600 italic whitespace-pre-wrap">
              {settings.receiptNote || 'Terima kasih atas kunjungan Anda.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
