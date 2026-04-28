'use client';

import { useRouter } from 'next/navigation';
import { ShieldX, Warehouse as WarehouseIcon, Plus } from 'lucide-react';

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

// ─── ForbiddenPage ────────────────────────────────────────────────────────────

export function ForbiddenPage({ role }: { role: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center border border-red-500/20">
            <ShieldX className="w-12 h-12 text-red-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Halaman <span className="text-white font-semibold">Manajemen Gudang</span> hanya dapat diakses oleh{' '}
            <span className="text-purple-400 font-semibold">Owner</span> atau{' '}
            <span className="text-orange-400 font-semibold">Gudang</span>.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg">
            <span className="text-xs text-zinc-500">Role Anda:</span>
            <span className="text-xs font-semibold text-orange-400 capitalize">{role}</span>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold transition-all text-white text-sm"
        >
          Kembali ke Dashboard
        </button>
        <p className="text-zinc-700 text-xs">Hubungi Owner jika Anda membutuhkan akses ke halaman ini.</p>
      </div>
    </div>
  );
}

// ─── LoadingState ─────────────────────────────────────────────────────────────

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-48 text-zinc-500">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
      Memuat data gudang...
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

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
      <WarehouseIcon className="w-12 h-12 mb-3 text-zinc-700" />
      <p className="text-sm text-center">Belum ada gudang. Tambahkan gudang pertama Anda.</p>
      <button
        onClick={onAdd}
        className="mt-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-semibold text-sm transition-colors text-white"
      >
        <Plus className="w-4 h-4" />
        Tambah Gudang
      </button>
    </div>
  );
}