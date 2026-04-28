'use client';

import { Package, Plus, Menu, Eye } from 'lucide-react';

interface ProductHeaderProps {
  canEdit: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onAdd: () => void;
}

export default function ProductHeader({
  canEdit,
  mobileMenuOpen,
  onToggleMobileMenu,
  onAdd,
}: ProductHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
              <span>Manajemen Produk</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-zinc-400 text-sm hidden sm:block">Kelola data produk dan stok</p>
              {!canEdit && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-lg border border-zinc-700">
                  <Eye className="w-3 h-3" />
                  Hanya Lihat
                </span>
              )}
            </div>
          </div>

          {canEdit && (
            <button
              onClick={onToggleMobileMenu}
              className="sm:hidden p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Desktop add button */}
        {canEdit && (
          <button
            onClick={onAdd}
            className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        )}

        {/* Mobile dropdown */}
        {canEdit && mobileMenuOpen && (
          <div className="sm:hidden flex flex-col gap-2 pt-4 border-t border-zinc-800">
            <button
              onClick={onAdd}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors px-4 py-3 rounded-xl font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Produk
            </button>
          </div>
        )}
      </div>

      <p className="text-zinc-400 text-sm mt-2 sm:hidden">Kelola data produk dan stok</p>
    </header>
  );
}