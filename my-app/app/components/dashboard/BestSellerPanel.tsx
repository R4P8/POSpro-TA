'use client';

import { TrendingUp, Package, RefreshCw } from 'lucide-react';
import { formatRp } from '@/app/admin/dashboard/utils';
import type { BestSellerProduct } from '@/app/admin/dashboard/types';

interface BestSellerPanelProps {
  data:     BestSellerProduct[];
  loading:  boolean;
  error:    string | null;
  onRefresh: () => void;
}

export default function BestSellerPanel({ data, loading, error, onRefresh }: BestSellerPanelProps) {
  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 md:p-6 border border-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Produk Terlaris
          {!loading && data.length > 0 && (
            <span className="text-xs font-normal text-zinc-500">({data.length})</span>
          )}
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* States */}
      {loading && <InlineLoading color="purple" label="Memuat data..." />}

      {!loading && error && <InlineError message={error} onRetry={onRefresh} />}

      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
          <Package className="w-8 h-8 mb-2" />
          <p className="text-sm">Belum ada data produk terlaris</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="space-y-2 md:space-y-3">
          {data.map((product, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-zinc-800/30 rounded-xl hover:bg-zinc-800/50 transition-colors group">
              <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base group-hover:text-purple-400 transition-colors truncate">{product.name}</h3>
                <p className="text-xs text-zinc-500">{formatRp(product.price)} / pcs</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm">{product.quantity} terjual</p>
                <p className="text-xs text-zinc-500">{formatRp(product.price * product.quantity)}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-xs text-zinc-400">Stok:</p>
                <p className={`font-semibold text-sm ${product.stock <= 10 ? 'text-orange-400' : 'text-green-400'}`}>
                  {product.stock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared inline atoms (panel-scoped) ──────────────────────────────────────

function InlineLoading({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-zinc-500 gap-3">
      <div className={`w-5 h-5 border-2 border-${color}-500 border-t-transparent rounded-full animate-spin`} />
      {label}
    </div>
  );
}

function InlineError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-center">
      <p className="text-red-400 text-sm">Gagal memuat: {message}</p>
      <button onClick={onRetry} className="mt-1 text-xs text-red-400 underline">Coba lagi</button>
    </div>
  );
}