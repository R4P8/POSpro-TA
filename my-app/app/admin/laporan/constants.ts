import { TrendingUp, Package, Users } from 'lucide-react';
import type { TabConfig, CashierPerformance } from './types';

export const TABS: (TabConfig & { icon: React.ElementType })[] = [
  { id: 'penjualan', name: 'Penjualan per Periode', short: 'Periode', icon: TrendingUp },
  { id: 'produk',    name: 'Penjualan per Produk',  short: 'Produk',  icon: Package   },
  { id: 'stok',      name: 'Histori Stok',           short: 'Stok',    icon: Package   },
  { id: 'kasir',     name: 'Performa Kasir',         short: 'Kasir',   icon: Users     },
];

export const DATE_PRESETS = [
  { label: '7H',  days: 7  },
  { label: '14H', days: 14 },
  { label: '30H', days: 30 },
  { label: '3B',  days: 90 },
];

// Static data — replace with API call when endpoint is available
export const CASHIER_PERFORMANCE: CashierPerformance[] = [
  { name: 'Rina Wijaya',    transactions: 487, revenue: 'Rp 28.9jt', avg: 'Rp 59k', rating: 4.8 },
  { name: 'Budi Santoso',   transactions: 423, revenue: 'Rp 25.3jt', avg: 'Rp 60k', rating: 4.7 },
  { name: 'Siti Nurhaliza', transactions: 398, revenue: 'Rp 22.1jt', avg: 'Rp 55k', rating: 4.6 },
  { name: 'Ahmad Fauzi',    transactions: 367, revenue: 'Rp 20.8jt', avg: 'Rp 57k', rating: 4.5 },
  { name: 'Dewi Lestari',   transactions: 334, revenue: 'Rp 18.9jt', avg: 'Rp 57k', rating: 4.4 },
];