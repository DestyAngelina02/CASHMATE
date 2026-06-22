'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState({ storeName: '', address: '', phone: '', taxRate: 0, currency: 'IDR' });
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
        setMessage('Pengaturan berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-neutral-400">Memuat pengaturan...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pengaturan Toko</h1>
        <p className="text-neutral-400 mt-1 text-sm">Konfigurasi informasi umum toko Anda.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('Gagal') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-neutral-800 pb-4">Informasi Umum</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Nama Toko</label>
              <input type="text" value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Nomor Telepon</label>
              <input type="text" value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Alamat Lengkap</label>
              <textarea value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/50 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-neutral-800 pb-4">Keuangan & Pajak</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Mata Uang</label>
              <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                <option value="IDR">IDR - Rupiah</option>
                <option value="USD">USD - Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Pajak / PPN (%)</label>
              <input type="number" step="0.1" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => fetchSettings()} className="px-6 py-3 rounded-xl font-medium text-neutral-400 hover:bg-neutral-900 transition-colors">
            Reset
          </button>
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
