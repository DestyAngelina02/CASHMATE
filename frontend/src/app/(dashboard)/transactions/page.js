'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function POSPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // State Kasir / Cart
  const [cart, setCart] = useState([]);
  const [paidAmount, setPaidAmount] = useState('');
  
  // Checkout State
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    // Auto-focus search input (untuk scanner barcode)
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cari produk (berdasarkan nama atau barcode)
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.barcode && p.barcode.toLowerCase() === search.toLowerCase())
  );

  // Jika input sesuai persis dengan barcode, langsung tambah ke keranjang & clear search
  useEffect(() => {
    if (search) {
      const exactMatch = products.find(p => p.barcode && p.barcode.toLowerCase() === search.toLowerCase());
      if (exactMatch) {
        addToCart(exactMatch);
        setSearch(''); // Kosongkan lagi untuk scan berikutnya
      }
    }
  }, [search, products]);

  const addToCart = (product) => {
    setError('');
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          setError(`Stok ${product.name} tidak mencukupi.`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      if (product.stock < 1) {
        setError(`Stok ${product.name} kosong.`);
        return prev;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty > item.stock) {
          setError(`Maksimal stok ${item.name} adalah ${item.stock}`);
          return item;
        }
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
  const changeAmount = parseFloat(paidAmount || 0) - totalAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return setError('Keranjang masih kosong.');
    if (changeAmount < 0) return setError('Uang bayar tidak mencukupi.');

    setProcessing(true);
    setError('');

    const payload = {
      userId: 1, // Hardcode admin for now
      totalAmount,
      grandTotal: totalAmount,
      paidAmount: parseFloat(paidAmount || 0),
      changeAmount: changeAmount > 0 ? changeAmount : 0,
      paymentMethod: 'CASH',
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.qty,
        unitPrice: parseFloat(item.price),
        subtotal: parseFloat(item.price) * item.qty
      }))
    };

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal memproses transaksi');
      
      // Sukses! Arahkan ke halaman struk
      setCart([]);
      setPaidAmount('');
      router.push(`/transactions/receipt/${json.data.id}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Area Kiri: Daftar Produk */}
      <div className="flex-1 flex flex-col bg-neutral-900/40 rounded-2xl border border-neutral-900 overflow-hidden">
        <div className="p-4 border-b border-neutral-900">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="🔍 Cari produk atau scan barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className="h-48 rounded-xl bg-neutral-800 animate-pulse" />
               ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500">
              <span className="text-4xl mb-3">📦</span>
              <p>Produk tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => addToCart(prod)}
                  className={`relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden cursor-pointer group transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 ${prod.stock < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="aspect-square bg-neutral-900 relative">
                    {prod.image ? (
                      <img src={`${BACKEND_URL}${prod.image}`} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xs">No Image</div>
                    )}
                    {prod.stock < 1 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-500 font-bold text-sm">HABIS</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white truncate">{prod.name}</h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">Rp {Number(prod.price).toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">Stok: {prod.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Area Kanan: Keranjang (Cart) */}
      <div className="w-full lg:w-96 flex flex-col bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-neutral-900 bg-neutral-900/30">
          <h2 className="font-bold text-white flex items-center gap-2">
            <span className="text-emerald-500">🛒</span> Keranjang Belanja
          </h2>
        </div>

        {/* Daftar Item */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-600">
              <p className="text-sm">Belum ada barang dipilih.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex flex-col gap-2 p-3 rounded-xl border border-neutral-800 bg-neutral-900/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Rp {Number(item.price).toLocaleString('id-ID')} / pcs</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-neutral-500 hover:text-rose-500 transition-colors">✕</button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3 bg-neutral-950 rounded-lg p-1 border border-neutral-800">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-neutral-900 text-neutral-300 hover:text-white flex items-center justify-center transition-colors">-</button>
                    <span className="text-sm font-medium text-white w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-neutral-900 text-neutral-300 hover:text-white flex items-center justify-center transition-colors">+</button>
                  </div>
                  <p className="text-sm font-bold text-white">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Pembayaran */}
        <div className="p-4 bg-neutral-900/80 border-t border-neutral-900">
          {error && <div className="mb-3 text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">{error}</div>}
          
          <div className="flex justify-between items-center mb-3 text-neutral-400 text-sm">
            <span>Total Item</span>
            <span>{cart.reduce((s, i) => s + i.qty, 0)} Pcs</span>
          </div>
          
          <div className="flex justify-between items-center mb-4 text-xl">
            <span className="font-bold text-white">Total</span>
            <span className="font-bold text-emerald-400">Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Uang Pembayaran (Rp)</label>
              <input
                type="number"
                min={totalAmount}
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-lg font-medium text-white focus:border-emerald-500/50 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-sm text-neutral-400">Kembalian</span>
              <span className={`font-bold ${changeAmount < 0 ? 'text-rose-400' : 'text-white'}`}>
                Rp {changeAmount > 0 ? changeAmount.toLocaleString('id-ID') : 0}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || cart.length === 0 || changeAmount < 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {processing ? 'Memproses...' : 'Proses Pembayaran'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
