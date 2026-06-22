'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function BarcodeCenterPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(r => r.json())
      .then(j => setProducts(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode || '').includes(search)
  );

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handlePrint = () => {
    const selectedProducts = products.filter(p => selected.includes(p.id));
    if (selectedProducts.length === 0) return alert('Pilih produk terlebih dahulu');

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Print Barcode</title>
      <style>
        body { font-family: monospace; margin: 0; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px; text-align: center; }
        .barcode { font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 8px 0; font-family: 'Libre Barcode 128', monospace; }
        .name { font-size: 11px; color: #333; }
        .price { font-size: 14px; font-weight: bold; }
        @media print { @page { margin: 10mm; } }
      </style>
      </head><body>
      <div class="grid">
        ${selectedProducts.map(p => `
          <div class="card">
            <div class="barcode">${p.barcode || '||||||||||'}</div>
            <div class="name">${p.name}</div>
            <div class="price">Rp ${Number(p.price).toLocaleString('id-ID')}</div>
            <div style="font-size:10px;color:#999">${p.barcode || 'NO-BARCODE'}</div>
          </div>
        `).join('')}
      </div>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Barcode Center</h1>
          <p className="text-neutral-500 text-sm mt-1">Pilih produk untuk generate dan cetak barcode label.</p>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <button onClick={handlePrint} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-lg text-sm transition-all">
              🖨️ Cetak Barcode ({selected.length})
            </button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <input type="text" placeholder="🔍 Cari produk atau barcode..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors" />
      </div>

      {selected.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
          <span className="text-sm text-emerald-400 font-medium">{selected.length} produk dipilih</span>
          <button onClick={() => setSelected([])} className="text-xs text-neutral-500 hover:text-white">Batal pilih</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)
        ) : filtered.map(p => (
          <div key={p.id}
            onClick={() => toggleSelect(p.id)}
            className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all ${
              selected.includes(p.id)
                ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                : 'border-white/5 bg-neutral-900/40 hover:border-white/20 hover:bg-neutral-900/80'
            }`}>
            {selected.includes(p.id) && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center z-10">
                <svg className="w-3 h-3 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="aspect-square bg-neutral-800/50 flex items-center justify-center">
              {p.image ? <img src={`${BACKEND_URL}${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                : <span className="text-4xl">📦</span>}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-white line-clamp-1">{p.name}</p>
              <p className="text-[10px] font-mono text-neutral-600 mt-0.5 truncate">{p.barcode || '(no barcode)'}</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">Rp {Number(p.price).toLocaleString('id-ID')}</p>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-600">
          <span className="text-4xl block mb-3">🔲</span>
          <p>Tidak ada produk ditemukan.</p>
        </div>
      )}
    </div>
  );
}
