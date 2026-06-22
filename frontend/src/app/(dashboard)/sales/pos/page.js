'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash', icon: '💵' },
  { value: 'QRIS', label: 'QRIS', icon: '📱' },
  { value: 'DANA', label: 'Dana', icon: '💙' },
  { value: 'OVO', label: 'OVO', icon: '💜' },
  { value: 'GOPAY', label: 'GoPay', icon: '💚' },
  { value: 'SHOPEEPAY', label: 'ShopeePay', icon: '🧡' },
  { value: 'TRANSFER', label: 'Transfer', icon: '🏦' },
];

export default function POSTerminalPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [cart, setCart] = useState([]);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products`).then(r => r.json()),
      fetch(`${API_URL}/categories`).then(r => r.json()),
    ]).then(([prod, cats]) => {
      setProducts(prod.data || []);
      setCategories(cats.data || []);
    }).catch(console.error).finally(() => setLoading(false));
    searchInputRef.current?.focus();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase() === search.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.categoryId === Number(selectedCategory);
    return matchSearch && matchCat;
  });

  useEffect(() => {
    if (search) {
      const exact = products.find(p => p.barcode && p.barcode.toLowerCase() === search.toLowerCase());
      if (exact) { addToCart(exact); setSearch(''); }
    }
  }, [search, products]);

  const addToCart = (product) => {
    setError('');
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) {
        if (ex.qty >= product.stock) { setError(`Stok ${product.name} tidak mencukupi.`); return prev; }
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      if (product.stock < 1) { setError(`Stok ${product.name} kosong.`); return prev; }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty > item.stock) { setError(`Maks stok: ${item.stock}`); return item; }
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => { setCart([]); setDiscount(0); setPaidAmount(''); setError(''); };

  const totalAmount = cart.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);
  const grandTotal = Math.max(0, totalAmount - parseFloat(discount || 0));
  const changeAmount = parseFloat(paidAmount || 0) - grandTotal;

  const handleCheckout = async () => {
    if (cart.length === 0) return setError('Keranjang masih kosong.');
    if (paymentMethod === 'CASH' && changeAmount < 0) return setError('Uang bayar tidak mencukupi.');
    setProcessing(true); setError('');
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, totalAmount, grandTotal,
          paidAmount: parseFloat(paidAmount || grandTotal),
          changeAmount: Math.max(0, changeAmount),
          paymentMethod, discount: parseFloat(discount || 0),
          items: cart.map(i => ({ productId: i.id, quantity: i.qty, unitPrice: parseFloat(i.price), subtotal: parseFloat(i.price) * i.qty }))
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal memproses');
      clearCart();
      router.push(`/transactions/receipt/${json.data.id}`);
    } catch (err) { setError(err.message); } finally { setProcessing(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col bg-neutral-900/30 rounded-2xl border border-white/5 overflow-hidden">
        {/* Search + Category Filter */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <input
              ref={searchInputRef} type="text"
              placeholder="🔍 Cari produk atau scan barcode..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-neutral-200 focus:border-emerald-500/50 focus:outline-none text-sm transition-colors"
            />
            {cart.length > 0 && (
              <button onClick={clearCart} className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-all whitespace-nowrap">
                🗑 Kosongkan
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-emerald-500 text-neutral-950' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
            >Semua</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-emerald-500 text-neutral-950' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
              >{cat.name}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-44 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-600">
              <span className="text-4xl mb-3">📦</span><p className="text-sm">Produk tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3">
              {filteredProducts.map(prod => (
                <div key={prod.id} onClick={() => prod.stock > 0 && addToCart(prod)}
                  className={`relative rounded-xl border bg-neutral-950 overflow-hidden transition-all ${prod.stock < 1 ? 'opacity-40 cursor-not-allowed border-white/5' : 'cursor-pointer border-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5'}`}>
                  <div className="aspect-square bg-neutral-900 relative">
                    {prod.image ? <img src={`${BACKEND_URL}${prod.image}`} alt={prod.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-neutral-700 text-3xl">📦</div>}
                    {prod.stock < 1 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-500 font-bold text-xs">HABIS</div>}
                    {cart.find(i => i.id === prod.id) && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center">
                        {cart.find(i => i.id === prod.id).qty}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-white truncate">{prod.name}</p>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">Rp {Number(prod.price).toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">Stok: {prod.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full lg:w-[360px] flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">🛒 Keranjang
            <span className="text-xs bg-emerald-500 text-neutral-950 font-bold px-1.5 py-0.5 rounded-full">{cart.reduce((s, i) => s + i.qty, 0)}</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-700 gap-2">
              <span className="text-4xl">🛒</span><p className="text-xs">Keranjang kosong</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="p-3 rounded-xl border border-white/5 bg-white/5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-white line-clamp-1 flex-1">{item.name}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-neutral-600 hover:text-rose-400 transition-colors ml-2 text-xs">✕</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-neutral-950 rounded-lg p-1 border border-white/5">
                  <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded bg-white/10 text-white text-xs flex items-center justify-center hover:bg-white/20">-</button>
                  <span className="text-xs font-bold text-white w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded bg-white/10 text-white text-xs flex items-center justify-center hover:bg-white/20">+</button>
                </div>
                <p className="text-xs font-bold text-emerald-400">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-3">
          {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{error}</div>}

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span>Rp {totalAmount.toLocaleString('id-ID')}</span></div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Diskon (Rp)</span>
              <input type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)}
                className="w-20 px-2 py-0.5 bg-neutral-950 border border-white/10 rounded text-right text-white text-xs focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5">
              <span className="text-white">Total</span>
              <span className="text-emerald-400">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Method Grid */}
          <div>
            <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider mb-2">Metode Bayar</p>
            <div className="grid grid-cols-4 gap-1.5">
              {PAYMENT_METHODS.map(m => (
                <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border text-center transition-all ${paymentMethod === m.value ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 bg-white/5 text-neutral-500 hover:bg-white/10'}`}>
                  <span className="text-sm">{m.icon}</span>
                  <span className="text-[9px] font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'CASH' && (
            <div>
              <label className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Uang Bayar</label>
              <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-base font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-neutral-600">Kembalian</span>
                <span className={`font-bold ${changeAmount < 0 ? 'text-rose-400' : 'text-white'}`}>
                  Rp {changeAmount > 0 ? changeAmount.toLocaleString('id-ID') : 0}
                </span>
              </div>
            </div>
          )}

          <button onClick={handleCheckout}
            disabled={processing || cart.length === 0 || (paymentMethod === 'CASH' && changeAmount < 0)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-40 disabled:shadow-none transition-all">
            {processing ? '⏳ Memproses...' : `✅ Bayar ${paymentMethod} — Rp ${grandTotal.toLocaleString('id-ID')}`}
          </button>
        </div>
      </div>
    </div>
  );
}
