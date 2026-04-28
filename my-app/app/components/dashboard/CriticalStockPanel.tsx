'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { CriticalStockProduct } from '@/app/admin/dashboard/types';

interface CriticalStockPanelProps {
  data:      CriticalStockProduct[];
  loading:   boolean;
  error:     string | null;
  onRefresh: () => void;
}

export default function CriticalStockPanel({ data, loading, error, onRefresh }: CriticalStockPanelProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 md:p-6 border border-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Stok Kritis
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
      {loading && (
        <div className="flex items-center justify-center h-32 text-zinc-500 gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Memuat data...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm">Gagal memuat: {error}</p>
          <button onClick={onRefresh} className="mt-1 text-xs text-red-400 underline">Coba lagi</button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
          <AlertTriangle className="w-8 h-8 mb-2 text-green-600" />
          <p className="text-sm text-green-600 font-medium">Semua stok aman</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="space-y-3">
          {data.map((item, i) => {
            const pct    = Math.min((item.stock / item.minimum_stock) * 100, 100);
            const isCrit = item.stock <= Math.floor(item.minimum_stock * 0.5);
            return (
              <div
                key={i}
                className={`p-3 md:p-4 rounded-xl border ${
                  isCrit ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm truncate pr-2">{item.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    isCrit ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {isCrit ? 'Kritis' : 'Peringatan'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                  <span className="text-zinc-400">Sisa: <span className="font-semibold text-white">{item.stock}</span></span>
                  <span className="text-zinc-500">Min: {item.minimum_stock}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isCrit ? 'bg-red-500' : 'bg-orange-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}