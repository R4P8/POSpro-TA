'use client';

import { FileText } from 'lucide-react';
import { useLaporan } from './useLaporan';
import { ForbiddenPage } from '@/app/components/laporan/ForbiddenPage';
import { TabBar } from '@/app/components/laporan/TabBar';
import { DateFilter } from '@/app/components/laporan/DateFilter';
import { ExportDropdown, SearchRefresh } from '@/app/components/laporan/LaporanAtoms';
import { TabPeriode } from '@/app/components/laporan/TabPeriode';
import { TabProduk } from '@/app/components/laporan/TabProduk';
import { TabStok } from '@/app/components/laporan/TabStok';
import { TabKasir } from '@/app/components/laporan/TabKasir';

export default function LaporanPage() {
  const lap = useLaporan();

  // Guard: loading role
  if (lap.roleLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  // Guard: bukan Owner
  if (lap.role !== 'Owner') return <ForbiddenPage role={lap.role ?? 'unknown'} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 overflow-auto">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-purple-400 flex-shrink-0" />
                Laporan
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Analisis lengkap performa bisnis Anda
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile date pill */}
              {lap.activeTab === 'penjualan' && (
                <DateFilter
                  startDate={lap.startDate}
                  endDate={lap.endDate}
                  onStartChange={lap.setStartDate}
                  onEndChange={lap.setEndDate}
                  showModal={lap.showDateModal}
                  onOpenModal={() => lap.setShowDateModal(true)}
                  onCloseModal={() => lap.setShowDateModal(false)}
                />
              )}

              {/* Export buttons per tab */}
              {lap.activeTab === 'penjualan' && (
                <ExportDropdown
                  show={lap.showExportPeriode}
                  onToggle={() => lap.setShowExportPeriode((v) => !v)}
                  loading={lap.exportPeriodeCsv.loading || lap.exportPeriodeExcel.loading}
                  label={`${lap.startDate} s/d ${lap.endDate}`}
                  onCsv={() => lap.exportPeriodeCsv.run(lap.setShowExportPeriode)}
                  onExcel={() => lap.exportPeriodeExcel.run(lap.setShowExportPeriode)}
                />
              )}
              {lap.activeTab === 'produk' && (
                <ExportDropdown
                  show={lap.showExportProduk}
                  onToggle={() => lap.setShowExportProduk((v) => !v)}
                  loading={lap.exportProdukCsv.loading || lap.exportProdukExcel.loading}
                  label="Laporan per Produk"
                  onCsv={() => lap.exportProdukCsv.run(lap.setShowExportProduk)}
                  onExcel={() => lap.exportProdukExcel.run(lap.setShowExportProduk)}
                />
              )}
              {lap.activeTab === 'stok' && (
                <ExportDropdown
                  show={lap.showExportStok}
                  onToggle={() => lap.setShowExportStok((v) => !v)}
                  loading={lap.exportStokCsv.loading || lap.exportStokExcel.loading}
                  label="Laporan Histori Stok"
                  onCsv={() => lap.exportStokCsv.run(lap.setShowExportStok)}
                  onExcel={() => lap.exportStokExcel.run(lap.setShowExportStok)}
                />
              )}
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-5">
          <TabBar activeTab={lap.activeTab} onChange={lap.handleTabChange} />

          {/* Desktop date filter — penjualan only */}
          {lap.activeTab === 'penjualan' && (
            <div className="hidden sm:block">
              <DateFilter
                startDate={lap.startDate}
                endDate={lap.endDate}
                onStartChange={lap.setStartDate}
                onEndChange={lap.setEndDate}
                showModal={false}
                onOpenModal={() => {}}
                onCloseModal={() => {}}
              />
            </div>
          )}

          {/* Search + Refresh */}
          {(lap.activeTab === 'penjualan' || lap.activeTab === 'produk') && (
            <SearchRefresh
              value={lap.search}
              onChange={lap.setSearch}
              placeholder={lap.activeTab === 'penjualan' ? 'Cari tanggal...' : 'Cari produk...'}
              onRefresh={lap.activeTab === 'penjualan' ? lap.refetchPeriode : lap.refetchProduk}
              isLoading={lap.activeTab === 'penjualan' ? lap.periodeLoading : lap.salesLoading}
            />
          )}

          {/* Tab content */}
          {lap.activeTab === 'penjualan' && (
            <TabPeriode
              rawSales={lap.rawSales}
              periodeData={lap.periodeData}
              filteredPeriode={lap.filteredPeriode}
              loading={lap.periodeLoading}
              error={lap.periodeError}
              search={lap.search}
              totalRevenue={lap.totalRevenuePeriode}
              totalTrx={lap.totalTrxPeriode}
              totalItems={lap.totalItemsPeriode}
              onRetry={lap.refetchPeriode}
            />
          )}
          {lap.activeTab === 'produk' && (
            <TabProduk
              salesProducts={lap.salesProducts}
              filteredSales={lap.filteredSales}
              loading={lap.salesLoading}
              error={lap.salesError}
              search={lap.search}
              totalRevenue={lap.totalRevenueProduk}
              totalQty={lap.totalQtyProduk}
              onRetry={lap.refetchProduk}
            />
          )}
          {lap.activeTab === 'stok' && (
            <TabStok
              stockData={lap.stockData}
              filteredStock={lap.filteredStock}
              loading={lap.stockLoading}
              error={lap.stockError}
              searchStock={lap.searchStock}
              onSearchChange={lap.setSearchStock}
              onRetry={lap.refetchStok}
            />
          )}
          {lap.activeTab === 'kasir' && <TabKasir />}
        </div>
      </main>
    </div>
  );
}