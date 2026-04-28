import { Warehouse, Plus, Menu } from 'lucide-react';
import { useState } from 'react';

interface GudangHeaderProps {
  onAdd: () => void;
}

export function GudangHeader({ onAdd }: GudangHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleAdd() {
    setMobileMenuOpen(false);
    onAdd();
  }

  return (
    <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Warehouse className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
              Manajemen Gudang
            </h1>
            <p className="text-zinc-400 text-sm mt-1 hidden sm:block">Kelola data gudang</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Gudang
        </button>

        {mobileMenuOpen && (
          <div className="sm:hidden flex flex-col gap-2 pt-4 border-t border-zinc-800">
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors px-4 py-3 rounded-xl font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Gudang
            </button>
          </div>
        )}
      </div>
      <p className="text-zinc-400 text-sm mt-2 sm:hidden">Kelola data gudang</p>
    </header>
  );
}