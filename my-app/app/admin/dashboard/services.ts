import { API_BASE, getAuthHeaders } from './utils';
import type { TransactionReport, BestSellerProduct, CriticalStockProduct } from './types';

async function authFetch<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 401) throw new Error('Sesi habis');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export const fetchTransactions  = () =>
  authFetch<TransactionReport>(`${API_BASE}/Api/transaction-report/cashier`);

export const fetchBestSellers   = () =>
  authFetch<BestSellerProduct>(`${API_BASE}/Api/products/report/best-seller`);

export const fetchCriticalStock = () =>
  authFetch<CriticalStockProduct>(`${API_BASE}/Api/products/report/critical-stock`);