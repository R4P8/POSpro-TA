'use client';

import { ShoppingCart, Eye, ArrowLeft } from 'lucide-react';
import CartItemRow from './CartItem';
import PaymentSection, { OwnerPaymentPlaceholder } from './PaymentSection';
import { formatRp } from '@/app/admin/pos/utils';
import type { CartItem } from '@/app/admin/pos/types';

interface CartPanelProps {
  cart:              CartItem[];
  totalQty:          number;
  subtotal:          number;
  readOnly:          boolean;
  paymentMethod:     string;
  cashInput:         string;
  cashNum:           number;
  change:            number;
  canPay:            boolean;
  processing:        boolean;
  onClearCart:       () => void;
  onRemoveItem:      (id: number) => void;
  onQtyChange:       (id: number, delta: number) => void;
  onMethodChange:    (id: string) => void;
  onCashInputChange: (v: string) => void;
  onCheckout:        () => void;
  onClose:           () => void;
}

export default function CartPanel({
  cart, totalQty, subtotal, readOnly,
  paymentMethod, cashInput, cashNum, change,
  canPay, processing,
  onClearCart, onRemoveItem, onQtyChange,
  onMethodChange, onCashInputChange, onCheckout, onClose,
}: CartPanelProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-400" />
          {readOnly ? 'Ringkasan' : 'Keranjang'}
          {cart.length > 0 && (
            <span className="px-2 py-0.5 bg-purple-500 rounded-full text-xs font-bold">{totalQty}</span>
          )}
        </h2>

        <div className="flex items-center gap-3">
          {readOnly && (
            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
              <Eye className="w-3 h-3" />
              View Only
            </span>
          )}
          {!readOnly && cart.length > 0 && (
            <button onClick={onClearCart} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
              Kosongkan
            </button>
          )}
          <button onClick={onClose} className="md:hidden p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-700">
            <ShoppingCart className="w-8 h-8 mb-2" />
            <p className="text-sm">{readOnly ? 'Tidak ada item' : 'Keranjang kosong'}</p>
          </div>
        ) : (
          cart.map(item => (
            <CartItemRow
              key={item.id}
              item={item}
              readOnly={readOnly}
              onRemove={onRemoveItem}
              onQtyChange={onQtyChange}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-sm">Subtotal</span>
          <span className="font-bold text-lg">{formatRp(subtotal)}</span>
        </div>

        {readOnly ? (
          <OwnerPaymentPlaceholder />
        ) : (
          <PaymentSection
            subtotal={subtotal}
            paymentMethod={paymentMethod}
            cashInput={cashInput}
            cashNum={cashNum}
            change={change}
            canPay={canPay}
            processing={processing}
            onMethodChange={onMethodChange}
            onCashInputChange={onCashInputChange}
            onCheckout={onCheckout}
          />
        )}
      </div>
    </div>
  );
}