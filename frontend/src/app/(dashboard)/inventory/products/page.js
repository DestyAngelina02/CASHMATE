'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const PAGE_SIZE = 10;

export default function InventoryProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', barcode: '', price: '', stock: '', categoryId: '', supplierId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        fetch(`${API_URL}/products`).then(r => r.json()),
        fetch(`${API_URL}/categories`).then(r => r.json()),
        fetch(`${API_URL}/suppliers`).then(r => r.json()),
      ]);
      setProducts(p.data || []);
      setCategories(c.data || []);
      setSuppliers(s.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.categoryId === Number(filterCat);
    const matchStock = filterStock === 'all' || (filterStock === 'low' && p.stock < 5) || (filterStock === 'out' && p.stock === 0) || (filterStock === 'ok' && p.stock >= 5);
    return matchSearch && matchCat && matchStock;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = (product = null) => {
    setFormData(product ? { id: product.id, name: product.name, barcode: product.barcode || '', price: product.price, stock: product.stock, categoryId: product.categoryId || '', supplierId: product.supplierId || '' } : { id: null, name: '', barcode: '', price: '', stock: '', categoryId: '', supplierId: '' });
    setImageFile(null); setModalError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setModalError('');
    try {
      const data = new FormData();
      ['name', 'price', 'stock', 'barcode', 'categoryId', 'supplierId'].forEach(k => { if (formData[k] !== '' && formData[k] != null) data.append(k, formData[k]); });
      if (imageFile) data.append('image', imageFile);
      const url = formData.id ? `${API_URL}/products/${formData.id}` : `${API_URL}/products`;
      const res = await fetch(url, { method: formData.id ? 'PUT' : 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setShowModal(false); fetchData();
    } catch (err) { setModalError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selected.length} produk?`)) return;
    await Promise.all(selected.map(id => fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })));
    setSelected([]); fetchData();
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(p => p.id));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Produk</h1>
          <p className="text-neutral-500 text-sm mt-1">{filtered.length} produk ditemukan</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {selected.length > 0 && (
            <button onClick={handleBulkDelete} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold rounded-lg text-sm hover:bg-rose-500/20 transition-all">
              🗑 Hapus ({selected.length})
            </button>
          )}
          <button onClick={() => openModal()} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-lg text-sm transition-all">
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" placeholder="🔍 Cari nama/barcode..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-sm text-neutral-300 focus:outline-none">
          <option value="all">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStock} onChange={e => { setFilterStock(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-sm text-neutral-300 focus:outline-none">
          <option value="all">Semua Stok</option>
          <option value="ok">Stok Aman (≥5)</option>
          <option value="low">Stok Rendah (&lt;5)</option>
          <option value="out">Habis</option>
        </select>
      </div>

      <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <input type="checkbox" className="rounded" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} />
                </th>
                <th className="px-4 py-3.5 text-left">Produk</th>
                <th className="px-4 py-3.5 text-left">Kategori</th>
                <th className="px-4 py-3.5 text-left">Barcode</th>
                <th className="px-4 py-3.5 text-left">Harga Jual</th>
                <th className="px-4 py-3.5 text-left">Stok</th>
                <th className="px-4 py-3.5 text-left">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-neutral-600">Tidak ada produk.</td></tr>
              ) : paginated.map(prod => (
                <tr key={prod.id} className={`hover:bg-white/5 transition-colors ${selected.includes(prod.id) ? 'bg-emerald-500/5' : ''}`}>
                  <td className="px-4 py-3.5">
                    <input type="checkbox" className="rounded" checked={selected.includes(prod.id)} onChange={() => toggleSelect(prod.id)} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                        {prod.image ? <img src={`${BACKEND_URL}${prod.image}`} alt={prod.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                      </div>
                      <span className="font-medium text-white line-clamp-1">{prod.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-400">{prod.category?.name || '-'}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-neutral-500">{prod.barcode || '-'}</td>
                  <td className="px-4 py-3.5 font-semibold text-emerald-400">Rp {Number(prod.price).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3.5 font-bold text-white">{prod.stock}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${prod.stock === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : prod.stock < 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {prod.stock === 0 ? 'HABIS' : prod.stock < 5 ? 'RENDAH' : 'TERSEDIA'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button onClick={() => openModal(prod)} className="text-xs text-teal-500 hover:text-teal-400 px-2 py-1 rounded-lg hover:bg-teal-500/10 transition-all">Edit</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-xs text-rose-500 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-all">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5 text-sm">
            <span className="text-neutral-600">Hal {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 disabled:opacity-30 transition-all">← Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 disabled:opacity-30 transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{formData.id ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white">✕</button>
            </div>
            {modalError && <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{modalError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Nama Produk *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Harga Jual *</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Stok *</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData(f => ({ ...f, stock: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Barcode</label>
                <input type="text" value={formData.barcode} onChange={e => setFormData(f => ({ ...f, barcode: e.target.value }))} placeholder="Opsional"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-neutral-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Kategori</label>
                  <select value={formData.categoryId} onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none">
                    <option value="">-- Pilih --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Supplier</label>
                  <select value={formData.supplierId} onChange={e => setFormData(f => ({ ...f, supplierId: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-white text-sm focus:outline-none">
                    <option value="">-- Pilih --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Gambar</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-neutral-400 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-sm transition-all">Batal</button>
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
