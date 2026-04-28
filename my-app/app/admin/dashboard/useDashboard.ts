'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { fetchTransactions, fetchBestSellers, fetchCriticalStock } from './services';
import { formatRp } from './utils';
import type { TransactionReport, BestSellerProduct, CriticalStockProduct, StatCard } from './types';

// ─── Generic async-slice factory ─────────────────────────────────────────────
function useAsyncSlice<T>(fetcher: () => Promise<T[]>) {
  const [data, setData]       = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await fetcher()); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [fetcher]);

  return { data, loading, error, load };
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useDashboard() {
  const router = useRouter();

  // Role guard
  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setRole(localStorage.getItem('userRole') ?? '');
    setRoleLoading(false);
  }, [router]);

  // Data slices
  const trx      = useAsyncSlice(fetchTransactions);
  const best     = useAsyncSlice(fetchBestSellers);
  const critical = useAsyncSlice(fetchCriticalStock);

  const fetchAll = useCallback(() => {
    trx.load();
    best.load();
    critical.load();
  }, [trx.load, best.load, critical.load]);

  useEffect(() => {
    if (role === 'Owner') fetchAll();
  }, [role, fetchAll]);

  // Computed
  const todayStr   = new Date().toDateString();
  const todayTrx   = trx.data.filter((t) => new Date(t.created_at).toDateString() === todayStr);
  const todaySales = todayTrx.reduce((s, t) => s + t.total_amount, 0);

  const stats: StatCard[] = [
    {
      title:      'Total Penjualan Hari Ini',
      value:      formatRp(todaySales),
      change:     `${todayTrx.length} trx`,
      isPositive: true,
      icon:       TrendingUp,
      color:      'purple',
    },
    {
      title:      'Jumlah Transaksi',
      value:      String(trx.data.length),
      change:     `${todayTrx.length} hari ini`,
      isPositive: true,
      icon:       ShoppingCart,
      color:      'blue',
    },
    {
      title:      'Total Item Terjual',
      value:      String(trx.data.reduce((s, t) => s + t.quantity, 0)),
      change:     'semua waktu',
      isPositive: true,
      icon:       Package,
      color:      'green',
    },
    {
      title:      'Stok Kritis',
      value:      critical.loading ? '...' : `${critical.data.length} item`,
      change:     critical.data.length > 0 ? `${critical.data.length} produk` : 'aman',
      isPositive: critical.data.length === 0,
      icon:       AlertTriangle,
      color:      'orange',
    },
  ];

  const isAnyLoading = trx.loading || best.loading || critical.loading;

  return {
    role, roleLoading,
    trx, best, critical,
    stats, isAnyLoading,
    fetchAll,
  };
}