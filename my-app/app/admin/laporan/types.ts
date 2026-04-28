export interface SalesProduct {
  name: string;
  stock: number;
  quantity: number;
  price: number;
}

export interface ProductStockHistory {
  created_at: string;
  name: string;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
}

export interface SalesPerDay {
  created_at: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AggregatedDay {
  date: string;
  label: string;
  transaksi: number;
  revenue: number;
  items: number;
  growth: number;
}

export interface CashierPerformance {
  name: string;
  transactions: number;
  revenue: string;
  avg: string;
  rating: number;
}

export type TabId = 'penjualan' | 'produk' | 'stok' | 'kasir';

export interface TabConfig {
  id: TabId;
  name: string;
  short: string;
}