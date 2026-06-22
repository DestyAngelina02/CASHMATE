export default function Topbar() {
  return (
    <header className="h-16 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h1 className="text-sm font-medium text-neutral-300 hidden sm:block">Cashmate Workspace</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">Administrator</div>
            <div className="text-xs text-neutral-500">admin@cashmate.com</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
