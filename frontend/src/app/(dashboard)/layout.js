import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black font-sans text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="mx-auto max-w-6xl relative">
            {children}
            
            {/* Floating Action Button V2 */}
            <div className="fixed bottom-8 right-8 z-50 group">
              <button className="h-14 w-14 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-2xl font-bold transition-all group-hover:rotate-45">
                +
              </button>
              <div className="absolute bottom-full right-0 mb-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col gap-1.5 items-end">
                <a href="/sales/pos" className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium">
                  🖥️ Kasir Baru (POS)
                </a>
                <a href="/inventory/products" className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium">
                  📦 Tambah Produk
                </a>
                <a href="/customers" className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium">
                  👥 Pelanggan Baru
                </a>
                <a href="/inventory/suppliers" className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium">
                  🚚 Supplier Baru
                </a>
                <a href="/inventory/stock" className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium">
                  📊 Penyesuaian Stok
                </a>
                <a href="/reports" className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl shadow-xl hover:bg-neutral-800 whitespace-nowrap text-sm font-medium">
                  📄 Buat Laporan
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
