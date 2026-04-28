import { Package } from 'lucide-react';
import type { ProductStockHistory } from '@/app/admin/laporan/types';
import { formatDateShort } from '@/app/admin/laporan/utils';
import { SummaryCard, LoadingState, ErrorState, EmptyState, SearchRefresh } from '../laporan/LaporanAtoms';

function getStockStatus(d: ProductStockHistory) {
  const isCritical = d.stock <= d.minimum_stock;
  const isWarning  = d.stock <= d.minimum_stock * 1.5 && !isCritical;
  return {
    isCritical,
    isWarning,
    color:      isCritical ? 'bg-red-500/20 text-red-400'    : isWarning ? 'bg-orange-500/20 text-orange-400'    : 'bg-green-500/20 text-green-400',
    stockColor: isCritical ? 'text-red-400'                  : isWarning ? 'text-orange-400'                     : 'text-zinc-200',
    label:      isCritical ? 'Kritis'                        : isWarning ? 'Peringatan'                          : 'Normal',
  };
}

function MobileRow({ d, i }: { d: ProductStockHistory; i: number }) {
  const { color, stockColor, label } = getStockStatus(d);
  return (
    <div className="p-3 bg-zinc-800/30 rounded-xl space-y-2 border border-zinc-800/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-zinc-600 w-5 flex-shrink-0">{i + 1}</span>
          <span className="font-medium text-sm truncate">{d.name}</span>
          {!d.is_active && (
            <span className="px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded text-xs flex-shrink-0">Nonaktif</span>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold flex-shrink-0 ${color}`}>{label}</span>
      </div>
      <div className="grid grid-cols-3 gap-1 pl-7">
        <div><p className="text-xs text-zinc-600">Stok</p><p className={`text-xs font-bold ${stockColor}`}>{d.stock}</p></div>
        <div><p className="text-xs text-zinc-600">Min. Stok</p><p className="text-xs text-zinc-400">{d.minimum_stock}</p></div>
        <div>
          <p className="text-xs text-zinc-600">Update</p>
          <p className="text-xs text-zinc-500">
            {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
    </div>
  );
}

interface TabStokProps {
  stockData: ProductStockHistory[];
  filteredStock: ProductStockHistory[];
  loading: boolean;
  error: string | null;
  searchStock: string;
  onSearchChange: (v: string) => void;
  onRetry: () => void;
}

export function TabStok({
  stockData,
  filteredStock,
  loading,
  error,
  searchStock,
  onSearchChange,
  onRetry,
}: TabStokProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-3 sm:p-6 border border-zinc-800/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-xl font-bold">Histori Stok</h2>
        {!loading && stockData.length > 0 && (
          <span className="text-xs text-zinc-500">{stockData.length} produk</span>
        )}
      </div>

      <div className="mb-4">
        <SearchRefresh
          value={searchStock}
          onChange={onSearchChange}
          placeholder="Cari produk..."
          onRefresh={onRetry}
          isLoading={loading}
        />
      </div>

      {!loading && !error && stockData.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <SummaryCard label="Total Produk" value={String(stockData.length)} />
          <SummaryCard label="Stok Kritis"  value={String(stockData.filter((d) => d.stock <= d.minimum_stock).length)} color="text-red-400" />
          <SummaryCard label="Produk Aktif" value={String(stockData.filter((d) => d.is_active).length)} color="text-green-400" />
        </div>
      )}

      {loading  && <LoadingState text="Memuat histori stok..." />}
      {!loading && error && <ErrorState msg={error} onRetry={onRetry} />}
      {!loading && !error && stockData.length === 0 && <EmptyState icon={Package} text="Belum ada data stok" />}

      {!loading && !error && filteredStock.length > 0 && (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                  <th className="pb-3 font-medium w-8">#</th>
                  <th className="pb-3 font-medium">Produk</th>
                  <th className="pb-3 font-medium text-right">Stok</th>
                  <th className="pb-3 font-medium text-right">Min. Stok</th>
                  <th className="pb-3 font-medium text-right">Terakhir Update</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.map((d, i) => {
                  const { color, stockColor, label } = getStockStatus(d);
                  return (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm">
                      <td className="py-3 text-zinc-500 text-xs">{i + 1}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{d.name}</span>
                          {!d.is_active && (
                            <span className="px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded text-xs">Nonaktif</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-bold ${stockColor}`}>{d.stock.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="py-3 text-right text-zinc-500">{d.minimum_stock.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right text-zinc-500 text-xs">{formatDateShort(d.created_at)}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${color}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-2">
            {filteredStock.map((d, i) => <MobileRow key={i} d={d} i={i} />)}
          </div>
        </>
      )}

      {!loading && !error && stockData.length > 0 && filteredStock.length === 0 && (
        <p className="text-center text-zinc-600 text-sm py-6">Produk "{searchStock}" tidak ditemukan</p>
      )}
    </div>
  );
}