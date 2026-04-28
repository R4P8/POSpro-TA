import { useState } from 'react';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SalesProduct } from '@/app/admin/laporan/types';
import { formatRp, formatRpCompact } from '@/app/admin/laporan/utils';
import { SummaryCard, LoadingState, ErrorState, EmptyState } from '../laporan/LaporanAtoms';

const PAGE_SIZE = 10;

function MobileRow({ p, i }: { p: SalesProduct; i: number }) {
  return (
    <div className="p-3 bg-zinc-800/30 rounded-xl space-y-2 border border-zinc-800/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-zinc-600 w-5 flex-shrink-0">{i + 1}</span>
          <span className="font-medium text-sm truncate">{p.name}</span>
        </div>
        <span className="text-xs font-semibold text-green-400 flex-shrink-0">
          {formatRpCompact(p.price * p.quantity)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 pl-7">
        <div><p className="text-xs text-zinc-600">Harga</p><p className="text-xs text-zinc-400">{formatRpCompact(p.price)}</p></div>
        <div><p className="text-xs text-zinc-600">Terjual</p><p className="text-xs font-semibold">{p.quantity}</p></div>
        <div><p className="text-xs text-zinc-600">Stok</p><p className={`text-xs font-semibold ${p.stock <= 10 ? 'text-orange-400' : 'text-zinc-300'}`}>{p.stock}</p></div>
      </div>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, totalItems, pageSize, onChange }: PaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
      <p className="text-xs text-zinc-500">
        {start}–{end} dari {totalItems} produk
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`e-${idx}`} className="px-1 text-zinc-600 text-xs">…</span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                item === page
                  ? 'bg-purple-500 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface TabProdukProps {
  salesProducts: SalesProduct[];
  filteredSales: SalesProduct[];
  loading: boolean;
  error: string | null;
  search: string;
  totalRevenue: number;
  totalQty: number;
  onRetry: () => void;
}

export function TabProduk({
  salesProducts,
  filteredSales,
  loading,
  error,
  search,
  totalRevenue,
  totalQty,
  onRetry,
}: TabProdukProps) {
  const [page, setPage] = useState(1);

  const totalPages  = Math.ceil(filteredSales.length / PAGE_SIZE);
  const safePage    = Math.min(page, totalPages || 1);
  const paginated   = filteredSales.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Reset page saat hasil filter berubah drastis
  if (safePage !== page) setPage(safePage);

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-3 sm:p-6 border border-zinc-800/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-xl font-bold">Penjualan per Produk</h2>
        {!loading && salesProducts.length > 0 && (
          <span className="text-xs text-zinc-500">{salesProducts.length} produk</span>
        )}
      </div>

      {!loading && !error && salesProducts.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <SummaryCard label="Total Revenue" value={formatRpCompact(totalRevenue)} color="text-green-400" />
          <SummaryCard label="Total Terjual" value={`${totalQty} item`} />
          <SummaryCard label="Jenis Produk"  value={`${salesProducts.length} SKU`} />
        </div>
      )}

      {loading  && <LoadingState text="Memuat data produk..." />}
      {!loading && error && <ErrorState msg={error} onRetry={onRetry} />}
      {!loading && !error && salesProducts.length === 0 && (
        <EmptyState icon={Package} text="Belum ada data penjualan produk" />
      )}

      {!loading && !error && filteredSales.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                  <th className="pb-3 font-medium w-8">#</th>
                  <th className="pb-3 font-medium">Nama Produk</th>
                  <th className="pb-3 font-medium text-right">Harga</th>
                  <th className="pb-3 font-medium text-right">Terjual</th>
                  <th className="pb-3 font-medium text-right">Total Revenue</th>
                  <th className="pb-3 font-medium text-right">Stok Sisa</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p, i) => (
                  <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm">
                    <td className="py-3 text-zinc-500 text-xs">
                      {(safePage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-right text-zinc-400">{formatRp(p.price)}</td>
                    <td className="py-3 text-right font-semibold">{p.quantity.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-right font-semibold text-green-400">{formatRp(p.price * p.quantity)}</td>
                    <td className="py-3 text-right">
                      <span className={`font-semibold ${p.stock <= 10 ? 'text-orange-400' : 'text-zinc-300'}`}>
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-700 text-sm font-bold">
                  <td /><td className="pt-3 text-zinc-400">TOTAL</td><td />
                  <td className="pt-3 text-right">{totalQty.toLocaleString('id-ID')}</td>
                  <td className="pt-3 text-right text-green-400">{formatRp(totalRevenue)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {paginated.map((p, i) => (
              <MobileRow key={i} p={p} i={(safePage - 1) * PAGE_SIZE + i} />
            ))}
            <div className="p-3 bg-zinc-800/60 rounded-xl flex justify-between text-xs font-bold border border-zinc-700/50">
              <span className="text-zinc-400">TOTAL</span>
              <div className="flex gap-3">
                <span>{totalQty} terjual</span>
                <span className="text-green-400">{formatRpCompact(totalRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filteredSales.length}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
            />
          )}
        </>
      )}

      {!loading && !error && salesProducts.length > 0 && filteredSales.length === 0 && (
        <p className="text-center text-zinc-600 text-sm py-6">Produk "{search}" tidak ditemukan</p>
      )}
    </div>
  );
}