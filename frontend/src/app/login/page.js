'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      // In a real app, you would validate credentials and store a token here
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center font-sans selection:bg-emerald-500 selection:text-neutral-950 px-6">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-neutral-950 text-2xl shadow-lg shadow-emerald-500/30 mb-4">
            C
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Masuk ke Cashmate</h1>
          <p className="text-sm text-neutral-500 mt-2">Silakan masuk untuk mengelola toko Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Email Admin</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                📧
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cashmate.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-white/5 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                🔒
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-white/5 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-neutral-950 text-emerald-500 focus:ring-emerald-500/50" />
              <span className="text-xs text-neutral-400">Ingat saya</span>
            </label>
            <a href="#" className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">Lupa password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Masuk Sekarang'}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-8">
          Masuk dengan akun <span className="font-semibold text-neutral-400">admin@cashmate.com</span> / <span className="font-semibold text-neutral-400">admin123</span> untuk demo.
        </p>
      </div>
    </div>
  );
}
