import { Building2, Plus, Menu } from 'lucide-react';
import { useState } from 'react';

interface UnitBisnisHeaderProps {
  onAdd: () => void;
}

export function UnitBisnisHeader({ onAdd }: UnitBisnisHeaderProps) {
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
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
              Unit Bisnis
            </h1>
            <p className="text-zinc-400 text-sm mt-1 hidden sm:block">
              Kelola outlet dan cabang bisnis
            </p>
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
          className="hidden sm:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Outlet
        </button>

        {mobileMenuOpen && (
          <div className="sm:hidden flex flex-col gap-2 pt-4 border-t border-zinc-800">
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Outlet
            </button>
          </div>
        )}
      </div>
      <p className="text-zinc-400 text-sm mt-2 sm:hidden">Kelola outlet dan cabang bisnis</p>
    </header>
  );
}