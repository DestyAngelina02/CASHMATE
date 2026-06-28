import React from 'react';
import { BarChart2, Package, Receipt } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-neutral-800 bg-neutral-950/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-neutral-950 text-xl shadow-lg shadow-emerald-500/20">
              C
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              CASHMATE
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</a>
            <a href="#statistik" className="hover:text-emerald-400 transition-colors">Statistik</a>
            <a href="#tentang" className="hover:text-emerald-400 transition-colors">Tentang Kami</a>
          </nav>

          <div>
            <a 
              href="/login" 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 transition-all text-neutral-200"
            >
              Masuk Sistem
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-8 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Sprint 1 Active: Database & Auth Setup
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
          Kelola Penjualan Anda Lebih{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Cerdas & Cepat
          </span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
          Aplikasi kasir digital berbasis web modern yang dirancang untuk mempercepat transaksi, mengelola stok real-time, dan memantau keuntungan bisnis Anda kapan saja.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-20">
          <a
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all text-center"
          >
            Mulai Demo
          </a>
          <a
            href="#backend-test"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-all text-center"
          >
            Pelajari API
          </a>
        </div>

        {/* Feature Cards Grid */}
        <section id="fitur" className="w-full py-16 border-t border-neutral-900">
          <div className="text-left mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Fitur Utama Cashmate</h2>
            <p className="text-neutral-400">Teknologi mutakhir untuk menyederhanakan operasional harian Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 font-semibold group-hover:bg-emerald-500/20 transition-all">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dashboard Real-Time</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Pantau total penjualan, total transaksi, keuntungan bersih, dan grafik tren secara real-time langsung dari satu layar dashboard yang interaktif.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/50 backdrop-blur-sm hover:border-teal-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 font-semibold group-hover:bg-teal-500/20 transition-all">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Manajemen Stok Otomatis</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Stok barang otomatis berkurang setiap transaksi sukses. Dilengkapi fitur Stock In, Stock Out, Adjustment, serta notifikasi jika stok menipis.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 font-semibold group-hover:bg-cyan-500/20 transition-all">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Kasir Cepat & Cetak Struk</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Keranjang belanja responsif dengan integrasi barcode/QR code scan, pengelolaan diskon, perhitungan pajak otomatis, dan opsi cetak struk fisik/PDF.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-neutral-950 text-sm">
              C
            </div>
            <span className="text-sm font-semibold tracking-tight text-neutral-400">
              CASHMATE © 2026. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-neutral-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
