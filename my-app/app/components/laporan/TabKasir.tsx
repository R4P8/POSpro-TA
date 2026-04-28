import type { CashierPerformance } from '@/app/admin/laporan/types';
import { CASHIER_PERFORMANCE } from '@/app/admin/laporan/constants';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-0.5">
      {[...Array(5)].map((_, j) => (
        <span key={j} className={`text-xs ${j < Math.floor(rating) ? 'text-yellow-400' : 'text-zinc-700'}`}>★</span>
      ))}
      <span className="text-xs text-zinc-500 ml-1">{rating}</span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('');
  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function CashierRow({ c, i }: { c: CashierPerformance; i: number }) {
  return (
    <div className="p-3 sm:p-4 bg-zinc-800/30 rounded-xl hover:bg-zinc-800/50 transition-colors">
      {/* Mobile */}
      <div className="flex items-center gap-3 sm:hidden">
        <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
          {i + 1}
        </span>
        <Avatar name={c.name} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{c.name}</p>
          <StarRating rating={c.rating} />
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-green-400">{c.revenue}</p>
          <p className="text-xs text-zinc-500">{c.transactions} trx</p>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm flex items-center justify-center flex-shrink-0">
          {i + 1}
        </div>
        <Avatar name={c.name} />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{c.name}</h3>
          <StarRating rating={c.rating} />
        </div>
        <div className="flex gap-6">
          <div><p className="text-sm font-semibold">{c.transactions}</p><p className="text-xs text-zinc-500">Transaksi</p></div>
          <div><p className="text-sm font-semibold text-green-400">{c.revenue}</p><p className="text-xs text-zinc-500">Revenue</p></div>
          <div><p className="text-sm font-semibold">{c.avg}</p><p className="text-xs text-zinc-500">Avg/Trx</p></div>
        </div>
      </div>
    </div>
  );
}

export function TabKasir() {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-3 sm:p-6 border border-zinc-800/50">
      <h2 className="text-base sm:text-xl font-bold mb-4">Performa Kasir</h2>
      <div className="space-y-2">
        {CASHIER_PERFORMANCE.map((c, i) => (
          <CashierRow key={i} c={c} i={i} />
        ))}
      </div>
    </div>
  );
}