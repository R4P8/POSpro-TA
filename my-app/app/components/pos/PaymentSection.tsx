'use client';

import { Eye, Receipt } from 'lucide-react';
import { formatRp } from '@/app/admin/pos/utils';
import { PAYMENT_METHODS, CASH_QUICK_AMOUNTS } from '@/app/admin/pos/constants';

interface PaymentSectionProps {
  subtotal:          number;
  paymentMethod:     string;
  cashInput:         string;
  cashNum:           number;
  change:            number;
  canPay:            boolean;
  processing:        boolean;
  onMethodChange:    (id: string) => void;
  onCashInputChange: (v: string) => void;
  onCheckout:        () => void;
}

export default function PaymentSection({
  subtotal, paymentMethod, cashInput, cashNum, change,
  canPay, processing, onMethodChange, onCashInputChange, onCheckout,
}: PaymentSectionProps) {
  return (
    <>
      {/* Payment method picker */}
      <div>
        <p className="text-xs text-zinc-500 mb-2">Metode Pembayaran</p>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => onMethodChange(m.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                  paymentMethod === m.id
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cash input */}
      {paymentMethod === 'cash' && (
        <div>
          <p className="text-xs text-zinc-500 mb-1.5">Uang Diterima</p>
          <input
            type="text"
            inputMode="numeric"
            value={cashInput}
            onChange={e => onCashInputChange(e.target.value.replace(/\D/g, ''))}
            placeholder="0"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-right font-bold focus:outline-none focus:border-purple-500"
          />
          {cashNum >= subtotal && subtotal > 0 && (
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-zinc-500">Kembalian</span>
              <span className="text-sm font-bold text-green-400">{formatRp(change)}</span>
            </div>
          )}
          {/* Quick-amount shortcuts */}
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {CASH_QUICK_AMOUNTS.map(v => (
              <button
                key={v}
                onClick={() => onCashInputChange(String(Math.ceil(subtotal / v) * v))}
                className="text-xs py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400"
              >
                {formatRp(v)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={onCheckout}
        disabled={!canPay || processing}
        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <Receipt className="w-4 h-4" />
            Bayar {subtotal > 0 ? formatRp(subtotal) : ''}
          </>
        )}
      </button>
    </>
  );
}

// ─── Owner-mode placeholder (shown instead of PaymentSection) ─────────────────

export function OwnerPaymentPlaceholder() {
  return (
    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
      <Eye className="w-4 h-4 text-amber-400 mx-auto mb-1" />
      <p className="text-xs text-amber-400 font-medium">Mode Lihat Saja</p>
      <p className="text-xs text-zinc-500 mt-0.5">Owner tidak dapat melakukan transaksi</p>
    </div>
  );
}