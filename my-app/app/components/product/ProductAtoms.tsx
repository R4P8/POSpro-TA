'use client';

import { Package, Plus } from 'lucide-react';

// ─── LoadingState ─────────────────────────────────────────────────────────────

export function LoadingState({ label = 'Memuat data produk...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center h-48 text-zinc-500">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
      {label}
    </div>
  );
}

// ─── ErrorState ───────────────────────────────────────────────────────────────

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-6 text-center">
      <p className="text-red-400 font-semibold">Gagal memuat data</p>
      <p className="text-zinc-500 text-sm mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-xl text-sm transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ canEdit, onAdd }: { canEdit: boolean; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
      <Package className="w-12 h-12 mb-3 text-zinc-700" />
      <p className="text-sm text-center">Belum ada produk.</p>
      {canEdit && (
        <button
          onClick={onAdd}
          className="mt-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      )}
    </div>
  );
}

// ─── RoleLoadingState ─────────────────────────────────────────────────────────

export function RoleLoadingState() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Memeriksa akses...</p>
      </div>
    </div>
  );
}