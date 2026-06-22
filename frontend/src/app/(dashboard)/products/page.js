'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, name: '', barcode: '', price: '', stock: '', categoryId: '', supplierId: '' 
  });
  const [imageFile, setImageFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat, resSup] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/suppliers`)
      ]);
      
      if (!resProd.ok) throw new Error('Gagal mengambil data produk.');
      
      const jsonProd = await resProd.json();
      const jsonCat = await resCat.json();
      const jsonSup = await resSup.json();
      
      setProducts(jsonProd.data);
      setCategories(jsonCat.data || []);
      setSuppliers(jsonSup.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menghapus produk.');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setFormData({ 
        id: product.id, 
        name: product.name, 
        barcode: product.barcode || '', 
        price: product.price, 
        stock: product.stock, 
        categoryId: product.categoryId || '', 
        supplierId: product.supplierId || '' 
      });
    } else {
      setFormData({ id: null, name: '', barcode: '', price: '', stock: '', categoryId: '', supplierId: '' });
    }
    setImageFile(null);
    setModalError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `${API_URL}/products/${formData.id}` : `${API_URL}/products`;
      
      // Menggunakan FormData karena kita mengirim file gambar
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      if (formData.barcode) data.append('barcode', formData.barcode);
      if (formData.categoryId) data.append('categoryId', formData.categoryId);
      if (formData.supplierId) data.append('supplierId', formData.supplierId);
      if (imageFile) data.append('image', imageFile);
      
      const res = await fetch(url, {
        method,
        body: data, // Tidak set Content-Type header agar browser otomatis set multipart/form-data boundary
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menyimpan produk.');
      
      setShowModal(false);
      fetchData();
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
          <h1 className="text-2xl font-bold text-white">Manajemen Produk</h1>
          <p className="text-neutral-400 mt-1 text-sm">Kelola inventaris, harga, dan gambar produk.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>+</span> Tambah Produk
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
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Produk</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kategori / Barcode</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Harga</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stok</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-900/50">
                    <td className="px-6 py-4"><div className="h-8 w-8 rounded bg-neutral-800 animate-pulse inline-block mr-3 align-middle" /><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/3 inline-block align-middle" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/3" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 text-sm">Belum ada produk.</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="border-b border-neutral-900/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {prod.image ? (
                          <div className="relative h-10 w-10 rounded overflow-hidden shrink-0 border border-neutral-800">
                             {/* Untuk kesederhanaan kita gunakan img tag standar, bisa diganti Next Image jika hostname dikonfigurasi */}
                             <img src={`${BACKEND_URL}${prod.image}`} alt={prod.name} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs shrink-0 border border-neutral-700">No Img</div>
                        )}
                        <span className="text-sm font-medium text-white line-clamp-2">{prod.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-300">{prod.category?.name || '-'}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{prod.barcode || 'Tanpa Barcode'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                      Rp {Number(prod.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-300">
                      <span className={`px-2 py-1 rounded-md ${prod.stock < 5 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}`}>{prod.stock}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(prod)} className="text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-500/10 mr-2">Edit</button>
                      <button onClick={() => handleDelete(prod.id)} className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{formData.id ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white transition-colors">✕</button>
            </div>
            
            {modalError && <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{modalError}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nama Produk</label>
                <input
                  type="text" required value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Harga (Rp)</label>
                  <input
                    type="number" required min="0" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Stok</label>
                  <input
                    type="number" required min="0" value={formData.stock} onChange={e => setFormData(f => ({ ...f, stock: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Barcode / QR Code</label>
                <input
                  type="text" value={formData.barcode} onChange={e => setFormData(f => ({ ...f, barcode: e.target.value }))} placeholder="Kosongkan jika tidak ada"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Kategori</label>
                  <select
                    value={formData.categoryId} onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Supplier</label>
                  <select
                    value={formData.supplierId} onChange={e => setFormData(f => ({ ...f, supplierId: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  >
                    <option value="">-- Pilih Supplier --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Gambar Produk (Opsional)</label>
                <input
                  type="file" accept="image/png, image/jpeg, image/webp"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
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
