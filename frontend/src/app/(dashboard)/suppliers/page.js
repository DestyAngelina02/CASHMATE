'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/suppliers`);
      if (!res.ok) throw new Error('Gagal mengambil data supplier.');
      const json = await res.json();
      setSuppliers(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus supplier ini?')) return;
    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menghapus supplier.');
      fetchSuppliers();
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (supplier = null) => {
    if (supplier) {
      setFormData({ id: supplier.id, name: supplier.name, phone: supplier.phone || '', address: supplier.address || '' });
    } else {
      setFormData({ id: null, name: '', phone: '', address: '' });
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
      const url = formData.id ? `${API_URL}/suppliers/${formData.id}` : `${API_URL}/suppliers`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, address: formData.address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menyimpan supplier.');
      
      setShowModal(false);
      fetchSuppliers();
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
          <h1 className="text-2xl font-bold text-white">Manajemen Supplier</h1>
          <p className="text-neutral-400 mt-1 text-sm">Kelola pemasok produk untuk sistem kasir.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>+</span> Tambah Supplier
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
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nama Supplier</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Telepon</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Alamat</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Jml Produk</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-900/50">
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4 ml-auto" /></td>
                  </tr>
                ))
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 text-sm">Belum ada supplier.</td>
                </tr>
              ) : (
                suppliers.map((sup) => (
                  <tr key={sup.id} className="border-b border-neutral-900/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{sup.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-400">{sup.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-400">{sup.address || '-'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-400">{sup._count?.products || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(sup)} className="text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-500/10 mr-2">Edit</button>
                      <button onClick={() => handleDelete(sup.id)} className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10">Hapus</button>
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
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{formData.id ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white transition-colors">✕</button>
            </div>
            {modalError && <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{modalError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nama Supplier</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nomor Telepon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Alamat</label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  rows={3}
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
