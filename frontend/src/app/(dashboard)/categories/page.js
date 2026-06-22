'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error('Gagal mengambil data kategori.');
      const json = await res.json();
      setCategories(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menghapus kategori.');
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setFormData({ id: category.id, name: category.name });
    } else {
      setFormData({ id: null, name: '' });
    }
    setModalError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `${API_URL}/categories/${formData.id}` : `${API_URL}/categories`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menyimpan kategori.');
      
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Kategori</h1>
          <p className="text-neutral-400 mt-1 text-sm">Kelola kategori produk untuk sistem kasir.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>+</span> Tambah Kategori
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="rounded-2xl border border-neutral-900 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-900">
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nama Kategori</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Jumlah Produk</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-900/50">
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4 ml-auto" /></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-neutral-500 text-sm">Belum ada kategori.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-neutral-900/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-400">{cat._count?.products || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(cat)} className="text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-500/10 mr-2">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{formData.id ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white transition-colors">✕</button>
            </div>
            {modalError && <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{modalError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-400 hover:text-white transition-all">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-neutral-950 font-semibold text-sm transition-all">
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
