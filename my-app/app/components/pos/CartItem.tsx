'use client';

import { X, Minus, Plus } from 'lucide-react';
import { formatRp } from '@/app/admin/pos/utils';
import type { CartItem as CartItemType } from '@/app/admin/pos/types';

interface CartItemProps {
  item:      CartItemType;
  readOnly:  boolean;
  onRemove:  (id: number) => void;
}

export default function CartItemRow({ item, readOnly, onRemove, onQtyChange }: CartItemProps) {
  return (
    <div className="bg-zinc-800 rounded-xl p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <p className="font-medium text-sm truncate">{item.name}</p>
          <p className="text-xs text-zinc-500">{formatRp(item.price_sell)} / pcs</p>
        </div>
        {!readOnly && (
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        {readOnly ? (
          <span className="text-xs text-zinc-500">Qty: {item.qty}</span>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQtyChange(item.id, -1)}
              className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
            <button
              onClick={() => onQtyChange(item.id, 1)}
              disabled={item.qty >= item.stock}
              className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
        <span className="font-bold text-sm text-green-400">{formatRp(item.price_sell * item.qty)}</span>
      </div>
    </div>
  );
}