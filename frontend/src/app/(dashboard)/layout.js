import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import FloatingActionButton from '@/components/layout/FloatingActionButton';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black font-sans text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="mx-auto max-w-6xl relative">
            {children}
            <FloatingActionButton />
          </div>
        </main>
      </div>
    </div>
  );
}
