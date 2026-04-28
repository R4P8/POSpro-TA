'use client';

import { ShoppingCart, RefreshCw } from 'lucide-react';
import { formatRp, formatTime } from '@/app/admin/dashboard/utils';
import type { TransactionReport } from '@/app/admin/dashboard/types';

interface TransactionTableProps {
  data:      TransactionReport[];
  loading:   boolean;
  error:     string | null;
  onRefresh: () => void;
}

function statusStyle(status: string) {
  if (status === 'completed' || status === 'selesai') return 'bg-green-500/20 text-green-400';
  if (status === 'pending') return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-zinc-700 text-zinc-400';
}

function statusLabel(status: string) {
  if (status === 'completed') return 'Selesai';
  if (status === 'pending')   return 'Pending';
  return status || 'Selesai';
}

export default function TransactionTable({ data, loading, error, onRefresh }: TransactionTableProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 md:p-6 border border-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-400" />
          Transaksi Terbaru
          {!loading && data.length > 0 && (
            <span className="text-xs font-normal text-zinc-500">({data.length} total)</span>
          )}
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center h-32 text-zinc-500 gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Memuat transaksi...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm font-medium">Gagal memuat: {error}</p>
          <button onClick={onRefresh} className="mt-2 text-xs text-red-400 hover:text-red-300 underline">Coba lagi</button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
          <ShoppingCart className="w-8 h-8 mb-2" />
          <p className="text-sm">Belum ada transaksi</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="text-left text-xs md:text-sm text-zinc-500 border-b border-zinc-800">
                {['No. Invoice', 'Waktu', 'Qty', 'Total', 'Kasir', 'Status'].map((h) => (
                  <th key={h} className="pb-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((trx, i) => (
                <tr key={`${trx.invoice_number}-${i}`} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 md:py-4">
                    <span className="font-mono text-xs md:text-sm text-purple-400">{trx.invoice_number}</span>
                  </td>
                  <td className="py-3 md:py-4 text-zinc-400 text-sm">{formatTime(trx.created_at)}</td>
                  <td className="py-3 md:py-4 text-sm">{trx.quantity} item</td>
                  <td className="py-3 md:py-4 font-semibold text-sm text-green-400">{formatRp(trx.total_amount)}</td>
                  <td className="py-3 md:py-4">
                    <span className="px-2 py-1 bg-zinc-800 rounded-lg text-xs md:text-sm">{trx.full_name || '—'}</span>
                  </td>
                  <td className="py-3 md:py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs md:text-sm ${statusStyle(trx.status)}`}>
                      {statusLabel(trx.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}