import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SalesPerDay, SalesProduct, ProductStockHistory, TabId } from './types';
import { fetchSalesPerDay, fetchSalesProducts, fetchStockHistory, downloadFile } from './services';
import { today, daysAgo } from './utils';
import { aggregateByDay } from './aggregations';

function useAsyncData<T>(fetcher: () => Promise<T>, initial: T) {
  const [data, setData]       = useState<T>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  return { data, loading, error, load };
}

function useExport(urlPath: string, filename: string) {
  const [loading, setLoading] = useState(false);

  async function run(setShow: (v: boolean) => void) {
    setLoading(true);
    setShow(false);
    try {
      await downloadFile(urlPath, filename);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, run };
}

export function useLaporan() {
  const router = useRouter();

  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [activeTab, setActiveTab]     = useState<TabId>('penjualan');
  const [search, setSearch]           = useState('');
  const [searchStock, setSearchStock] = useState('');
  const [startDate, setStartDate]     = useState(() => daysAgo(7));
  const [endDate, setEndDate]         = useState(today);
  const [showDateModal, setShowDateModal] = useState(false);

  // Export dropdown visibility
  const [showExportPeriode, setShowExportPeriode] = useState(false);
  const [showExportProduk,  setShowExportProduk]  = useState(false);
  const [showExportStok,    setShowExportStok]    = useState(false);

  // Data fetchers
  const periode  = useAsyncData(fetchSalesPerDay,   [] as SalesPerDay[]);
  const produk   = useAsyncData(fetchSalesProducts, [] as SalesProduct[]);
  const stok     = useAsyncData(fetchStockHistory,  [] as ProductStockHistory[]);

  // Exports
  const exportPeriodeCsv   = useExport(`/Api/transaction-report/sales/export/csv`,   `laporan-periode-${startDate}-${endDate}.csv`);
  const exportPeriodeExcel = useExport(`/Api/transaction-report/sales/export/excel`, `laporan-periode-${startDate}-${endDate}.xlsx`);
  const exportProdukCsv    = useExport(`/Api/products/report/sales/export/csv`,      `laporan-produk-${today}.csv`);
  const exportProdukExcel  = useExport(`/Api/products/report/sales/export/excel`,    `laporan-produk-${today}.xlsx`);
  const exportStokCsv      = useExport(`/Api/products/report/sales/export/csv`,      `laporan-stok-${today}.csv`);
  const exportStokExcel    = useExport(`/Api/products/report/sales/export/excel`,    `laporan-stok-${today}.xlsx`);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setRole(localStorage.getItem('userRole') ?? '');
    setRoleLoading(false);
  }, [router]);

  // Fetch all on role ready
  useEffect(() => {
    if (role === 'Owner') {
      periode.load();
      produk.load();
      stok.load();
    }
  }, [role]);

  // Derived: periode
  const filteredRaw     = periode.data.filter((d) => {
    const s = d.created_at.slice(0, 10);
    return s >= startDate && s <= endDate;
  });
  const periodeData       = aggregateByDay(filteredRaw);
  const filteredPeriode   = periodeData.filter((d) =>
    d.label.toLowerCase().includes(search.toLowerCase())
  );
  const totalRevenuePeriode = periodeData.reduce((s, d) => s + d.revenue, 0);
  const totalTrxPeriode     = periodeData.reduce((s, d) => s + d.transaksi, 0);
  const totalItemsPeriode   = periodeData.reduce((s, d) => s + d.items, 0);

  // Derived: produk
  const filteredSales      = produk.data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalRevenueProduk = produk.data.reduce((s, p) => s + p.price * p.quantity, 0);
  const totalQtyProduk     = produk.data.reduce((s, p) => s + p.quantity, 0);

  // Derived: stok
  const filteredStock = stok.data.filter((d) =>
    d.name.toLowerCase().includes(searchStock.toLowerCase())
  );

  function handleTabChange(id: TabId) {
    setActiveTab(id);
    setSearch('');
    setSearchStock('');
  }

  return {
    // Auth
    role,
    roleLoading,

    // Tab
    activeTab,
    handleTabChange,

    // Search
    search,
    setSearch,
    searchStock,
    setSearchStock,

    // Date filter
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showDateModal,
    setShowDateModal,

    // Periode
    rawSales: periode.data,
    periodeLoading: periode.loading,
    periodeError: periode.error,
    refetchPeriode: periode.load,
    periodeData,
    filteredPeriode,
    totalRevenuePeriode,
    totalTrxPeriode,
    totalItemsPeriode,

    // Produk
    salesProducts: produk.data,
    salesLoading: produk.loading,
    salesError: produk.error,
    refetchProduk: produk.load,
    filteredSales,
    totalRevenueProduk,
    totalQtyProduk,

    // Stok
    stockData: stok.data,
    stockLoading: stok.loading,
    stockError: stok.error,
    refetchStok: stok.load,
    filteredStock,

    // Exports
    showExportPeriode, setShowExportPeriode,
    showExportProduk,  setShowExportProduk,
    showExportStok,    setShowExportStok,
    exportPeriodeCsv,
    exportPeriodeExcel,
    exportProdukCsv,
    exportProdukExcel,
    exportStokCsv,
    exportStokExcel,
  };
}