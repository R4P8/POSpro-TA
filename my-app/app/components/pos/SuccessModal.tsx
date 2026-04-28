'use client';

import { CheckCircle } from 'lucide-react';
import { formatRp } from '@/app/admin/pos/utils';
import { PAYMENT_METHODS } from '@/app/admin/pos/constants';
import type { SuccessData } from '@/app/admin/pos/types';

interface SuccessModalProps {
  data:      SuccessData;
  onDismiss: () => void;
}

export default function SuccessModal({ data, onDismiss }: SuccessModalProps) {
  const methodLabel = PAYMENT_METHODS.find(m => m.id === data.method)?.label ?? data.method;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-sm text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-white" />
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-1">Transaksi Berhasil!</h3>
        <p className="text-zinc-500 text-sm mb-5">Pembayaran telah dikonfirmasi</p>

        {/* Receipt */}
        <div className="bg-zinc-800 rounded-2xl p-4 text-left space-y-3 mb-5">
          <Row label="No. Invoice">
            <span className="font-mono font-semibold text-purple-400 text-xs">{data.invoice}</span>
          </Row>
          <Row label="Total">
            <span className="font-bold text-green-400">{formatRp(data.total)}</span>
          </Row>
          <Row label="Metode">
            <span>{methodLabel}</span>
          </Row>
          {data.method === 'cash' && (
            <Row label="Kembalian">
              <span className="font-bold">{formatRp(data.change)}</span>
            </Row>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold transition-all hover:opacity-90"
        >
          Transaksi Baru
        </button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      {children}
    </div>
  );
}