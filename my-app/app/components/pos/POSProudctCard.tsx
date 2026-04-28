'use client';

import { Tag, TrendingUp, AlertTriangle, Pencil, Trash2, X, Check } from 'lucide-react';
import { formatRupiah } from '@/app/admin/product/utils';
import type { Product } from '@/app/admin/product/types';

interface ProductCardProps {
  product: Product;
  warehouseName: string;
  canEdit: boolean;
  deleteId: number | null;
  onEdit: (p: Product) => void;
  onDeleteRequest: (id: number) => void;
  onDeleteConfirm: (id: number) => void;
  onDeleteCancel: () => void;
}

export default function ProductCard({
  product: p,
  warehouseName,
  canEdit,
  deleteId,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: ProductCardProps) {
  const isLowStock  = p.stock <= p.minimum_stock;
  const isPendingDelete = deleteId === p.id;

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 sm:p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all group relative">
      {/* Status badge */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
          {p.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      </div>

      {/* Name + SKU */}
      <div className="mb-3 sm:mb-4 pr-16">
        <h3 className="text-base sm:text-lg font-bold group-hover:text-purple-400 transition-colors truncate">{p.name}</h3>
        <div className="flex items-center gap-1 mt-0.5">
          <Tag className="w-3 h-3 text-zinc-600 flex-shrink-0" />
          <span className="text-xs text-zinc-500 font-mono truncate">{p.sku}</span>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-zinc-800/60 rounded-xl p-2 sm:p-3">
          <p className="text-xs text-zinc-600 mb-0.5">Harga Beli</p>
          <p className="text-xs sm:text-sm font-semibold text-zinc-300 truncate">{formatRupiah(p.price_buy)}</p>
        </div>
        <div className="bg-zinc-800/60 rounded-xl p-2 sm:p-3">
          <p className="text-xs text-zinc-600 mb-0.5">Harga Jual</p>
          <p className="text-xs sm:text-sm font-semibold text-purple-400 truncate">{formatRupiah(p.price_sell)}</p>
        </div>
      </div>

      {/* Stock */}
      <div className={`flex items-center justify-between rounded-xl px-3 py-2 mb-3 ${isLowStock ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-zinc-800/60'}`}>
        <div className="flex items-center gap-1.5">
          {isLowStock
            ? <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            : <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />}
          <span className="text-xs text-zinc-500">Stok</span>
        </div>
        <div className="text-right">
          <span className={`font-bold text-sm ${isLowStock ? 'text-orange-400' : 'text-white'}`}>{p.stock}</span>
          <span className="text-zinc-600 text-xs"> / {p.minimum_stock}</span>
        </div>
      </div>

      {/* Footer: warehouse + actions */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-600 truncate max-w-[120px]">{warehouseName}</p>

        {canEdit && (
          <>
            {/* Desktop — hover reveal */}
            <div className="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-blue-600/30 hover:text-blue-400 transition-colors text-zinc-400">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              {isPendingDelete ? (
                <>
                  <button onClick={() => onDeleteConfirm(p.id)} className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition-colors"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={onDeleteCancel} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </>
              ) : (
                <button onClick={() => onDeleteRequest(p.id)} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600/30 hover:text-red-400 transition-colors text-zinc-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile — always visible */}
            <div className="flex sm:hidden gap-2">
              <button onClick={() => onEdit(p)} className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors">
                <Pencil className="w-4 h-4 text-blue-400" />
              </button>
              {isPendingDelete ? (
                <>
                  <button onClick={() => onDeleteConfirm(p.id)} className="p-2 rounded-lg bg-red-600"><Check className="w-4 h-4" /></button>
                  <button onClick={onDeleteCancel} className="p-2 rounded-lg bg-zinc-800"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <button onClick={() => onDeleteRequest(p.id)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}