import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { AggregatedDay, SalesPerDay } from '@/app/admin/laporan/types';
import { formatRp, formatRpCompact } from '@/app/admin/laporan/utils';
import { SummaryCard, LoadingState, ErrorState, EmptyState } from './LaporanAtoms';

interface MobileRowProps {
  d: AggregatedDay;
  i: number;
}

function MobileRow({ d, i }: MobileRowProps) {
  const isPositive = d.growth > 0;
  const isZero     = d.growth === 0;
  return (
    <div className="p-3 bg-zinc-800/30 rounded-xl space-y-2 border border-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 w-5">{i + 1}</span>
          <span className="font-medium text-sm">{d.label}</span>
        </div>
        {!isZero && (
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(d.growth).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 pl-7">
        <div><p className="text-xs text-zinc-600">Revenue</p><p className="text-xs font-semibold text-green-400">{formatRpCompact(d.revenue)}</p></div>
        <div><p className="text-xs text-zinc-600">Transaksi</p><p className="text-xs font-semibold">{d.transaksi}</p></div>
        <div><p className="text-xs text-zinc-600">Items</p><p className="text-xs font-semibold">{d.items}</p></div>
      </div>
    </div>
  );
}

interface TabPeriodeProps {
  rawSales: SalesPerDay[];
  periodeData: AggregatedDay[];
  filteredPeriode: AggregatedDay[];
  loading: boolean;
  error: string | null;
  search: string;
  totalRevenue: number;
  totalTrx: number;
  totalItems: number;
  onRetry: () => void;
}

export function TabPeriode({
  rawSales,
  periodeData,
  filteredPeriode,
  loading,
  error,
  search,
  totalRevenue,
  totalTrx,
  totalItems,
  onRetry,
}: TabPeriodeProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-3 sm:p-6 border border-zinc-800/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-xl font-bold">Penjualan per Periode</h2>
        {!loading && periodeData.length > 0 && (
          <span className="text-xs text-zinc-500">{periodeData.length} hari</span>
        )}
      </div>

      {!loading && !error && periodeData.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <SummaryCard label="Total Revenue"   value={formatRpCompact(totalRevenue)} color="text-green-400" />
          <SummaryCard label="Total Transaksi" value={totalTrx.toLocaleString('id-ID')} />
          <SummaryCard label="Items Terjual"   value={totalItems.toLocaleString('id-ID')} />
        </div>
      )}

      {loading  && <LoadingState text="Memuat data penjualan..." />}
      {!loading && error && <ErrorState msg={error} onRetry={onRetry} />}
      {!loading && !error && rawSales.length === 0 && <EmptyState icon={TrendingUp} text="Belum ada data transaksi" />}
      {!loading && !error && rawSales.length > 0 && periodeData.length === 0 && (
        <EmptyState icon={TrendingUp} text="Tidak ada data pada rentang ini" />
      )}

      {!loading && !error && filteredPeriode.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                  <th className="pb-3 font-medium w-8">#</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium text-right">Transaksi</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                  <th className="pb-3 font-medium text-right">Items</th>
                  <th className="pb-3 font-medium text-right">Pertumbuhan</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeriode.map((d, i) => {
                  const isPositive = d.growth > 0;
                  const isZero     = d.growth === 0;
                  return (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm">
                      <td className="py-3 text-zinc-500 text-xs">{i + 1}</td>
                      <td className="py-3 font-medium whitespace-nowrap">{d.label}</td>
                      <td className="py-3 text-right">{d.transaksi.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right font-semibold text-green-400">{formatRp(d.revenue)}</td>
                      <td className="py-3 text-right">{d.items.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right">
                        {isZero ? (
                          <span className="text-zinc-600 text-xs">—</span>
                        ) : (
                          <span className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-semibold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(d.growth).toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-700 text-sm font-bold">
                  <td /><td className="pt-3 text-zinc-400">TOTAL</td>
                  <td className="pt-3 text-right">{totalTrx.toLocaleString('id-ID')}</td>
                  <td className="pt-3 text-right text-green-400">{formatRp(totalRevenue)}</td>
                  <td className="pt-3 text-right">{totalItems.toLocaleString('id-ID')}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-2">
            {filteredPeriode.map((d, i) => <MobileRow key={i} d={d} i={i} />)}
            <div className="p-3 bg-zinc-800/60 rounded-xl flex justify-between text-xs font-bold border border-zinc-700/50">
              <span className="text-zinc-400">TOTAL</span>
              <div className="flex gap-3">
                <span>{totalTrx} transaksi</span>
                <span className="text-green-400">{formatRpCompact(totalRevenue)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !error && periodeData.length > 0 && filteredPeriode.length === 0 && (
        <p className="text-center text-zinc-600 text-sm py-6">Tidak ada hasil untuk "{search}"</p>
      )}
    </div>
  );
}