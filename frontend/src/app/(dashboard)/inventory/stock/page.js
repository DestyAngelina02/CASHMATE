'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StockManagementPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ productId: '', type: 'IN', quantity: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        fetch(`${API_URL}/products`).then(r => r.json()),
        fetch(`${API_URL}/stock`).then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      setProducts(p.data || []);
      setMovements(m.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: parseInt(form.quantity) })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setShowModal(false); setForm({ productId: '', type: 'IN', quantity: '', reason: '' });
      fetchData();
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  const lowStock = products.filter(p => p.stock < 5 && p.stock > 0);
  const outStock = products.filter(p => p.stock === 0);
  const okStock = products.filter(p => p.stock >= 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Stok</h1>
          <p className="text-neutral-500 text-sm mt-1">Monitor dan kelola pergerakan stok produk.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-lg text-sm transition-all">
          + Penyesuaian Stok
        </button>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stok Aman</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{okStock.length}</p>
          <p className="text-xs text-neutral-600 mt-1">produk</p>
        </div>
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stok Rendah</p>
          <p className="text-3xl font-bold text-amber-400 mt-2">{lowStock.length}</p>
          <p className="text-xs text-neutral-600 mt-1">produk (stok &lt; 5)</p>
        </div>
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stok Habis</p>
          <p className="text-3xl font-bold text-rose-400 mt-2">{outStock.length}</p>
          <p className="text-xs text-neutral-600 mt-1">produk</p>
        </div>
      </div>

      {/* Low & Out Stock Alerts */}
      {(lowStock.length > 0 || outStock.length > 0) && (
        <div className="mb-8 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <h2 className="text-sm font-bold text-amber-400 mb-3">⚠️ Peringatan Stok</h2>
          <div className="space-y-2">
            {outStock.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <span className="text-sm text-white">{p.name}</span>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">HABIS</span>
              </div>
            ))}
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <span className="text-sm text-white">{p.name}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">SISA {p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products Stock Table */}
      <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Stok Semua Produk</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
            <tr>
              <th className="px-5 py-3.5 text-left">Produk</th>
              <th className="px-5 py-3.5 text-left">Kategori</th>
              <th className="px-5 py-3.5 text-left">Stok Saat Ini</th>
              <th className="px-5 py-3.5 text-left">Status</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
              ))
            ) : products.map(p => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3.5 font-medium text-white">{p.name}</td>
                <td className="px-5 py-3.5 text-neutral-500">{p.category?.name || '-'}</td>
                <td className="px-5 py-3.5 font-bold text-white">{p.stock}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${p.stock === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : p.stock < 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {p.stock === 0 ? 'HABIS' : p.stock < 5 ? 'RENDAH' : 'AMAN'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => { setForm({ productId: p.id, type: 'IN', quantity: '', reason: '' }); setShowModal(true); }}
                    className="text-xs text-teal-500 hover:text-teal-400 px-2 py-1 rounded hover:bg-teal-500/10 transition-all">Sesuaikan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Penyesuaian Stok</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Produk</label>
                <select required value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none">
                  <option value="">-- Pilih Produk --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['IN', 'OUT', 'ADJUSTMENT'].map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${form.type === t ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 bg-white/5 text-neutral-500 hover:bg-white/10'}`}>
                    {t === 'IN' ? '📥 Masuk' : t === 'OUT' ? '📤 Keluar' : '🔄 Adjust'}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Jumlah</label>
                <input required type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Keterangan</label>
                <input type="text" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Opsional"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-neutral-700" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-neutral-400 text-sm hover:text-white transition-all">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-neutral-950 font-bold text-sm transition-all">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
