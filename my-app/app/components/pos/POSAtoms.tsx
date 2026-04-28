'use client';

import { Eye } from 'lucide-react';

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

export function OwnerBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2">
      <Eye className="w-4 h-4 text-amber-400" />
      <span className="text-xs text-amber-400 font-medium">
        Mode Lihat Saja — Owner tidak dapat melakukan transaksi
      </span>
    </div>
  );
}