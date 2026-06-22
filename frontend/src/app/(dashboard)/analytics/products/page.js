'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ProductAnalyticsPage() {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/reports/low-stock`).then(r => r.json()),
      fetch(`${API_URL}/products`).then(r => r.json()),
    ]).then(([ls, prod]) => {
      setData(ls.data);
      setProducts(prod.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const sorted = [...products].sort((a, b) => b.stock - a.stock);
  const topStock = sorted.slice(0, 5);
  const lowStock = products.filter(p => p.stock < 5).sort((a, b) => a.stock - b.stock);
  const outStock = products.filter(p => p.stock === 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Product Analytics</h1>
        <p className="text-neutral-500 text-sm mt-1">Analisis performa inventaris dan status produk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-2xl">📦</span>
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-3">Total Produk</p>
          {loading ? <div className="h-7 bg-white/5 rounded animate-pulse mt-1 w-16" /> : <p className="text-3xl font-bold text-emerald-400 mt-1">{products.length}</p>}
        </div>
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-2xl">⚠️</span>
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-3">Stok Rendah</p>
          {loading ? <div className="h-7 bg-white/5 rounded animate-pulse mt-1 w-16" /> : <p className="text-3xl font-bold text-amber-400 mt-1">{lowStock.length}</p>}
        </div>
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <span className="text-2xl">🚨</span>
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-3">Stok Habis</p>
          {loading ? <div className="h-7 bg-white/5 rounded animate-pulse mt-1 w-16" /> : <p className="text-3xl font-bold text-rose-400 mt-1">{outStock.length}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stock */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40">
          <h2 className="text-base font-semibold text-white mb-4">📈 Produk Stok Tertinggi</h2>
          <div className="space-y-3">
            {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)
              : topStock.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-neutral-700 w-5">#{i + 1}</span>
                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                    {p.image ? <img src={`${BACKEND_URL}${p.image}`} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">📦</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (p.stock / Math.max(...products.map(x => x.stock), 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white shrink-0">{p.stock}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Low / Out Stock */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40">
          <h2 className="text-base font-semibold text-white mb-4">🚨 Produk Stok Kritis</h2>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse mb-3" />)
          ) : lowStock.length === 0 && outStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-neutral-600">
              <span className="text-3xl mb-2">✅</span>
              <p className="text-sm">Semua stok dalam kondisi aman!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                      {p.image ? <img src={`${BACKEND_URL}${p.image}`} alt={p.name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-xs">📦</span>}
                    </div>
                    <span className="text-sm font-medium text-white line-clamp-1">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">HABIS</span>
                </div>
              ))}
              {lowStock.filter(p => p.stock > 0).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                      {p.image ? <img src={`${BACKEND_URL}${p.image}`} alt={p.name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-xs">📦</span>}
                    </div>
                    <span className="text-sm font-medium text-white line-clamp-1">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">SISA {p.stock}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
