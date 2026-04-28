import type { SalesPerDay, SalesProduct, ProductStockHistory } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getDownloadHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function assertOk(res: Response) {
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function fetchSalesPerDay(): Promise<SalesPerDay[]> {
  const res = await fetch(`${API_BASE}/Api/transaction-report/sales`, {
    headers: getAuthHeaders(),
  });
  assertOk(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchSalesProducts(): Promise<SalesProduct[]> {
  const res = await fetch(`${API_BASE}/Api/products/report/sales`, {
    headers: getAuthHeaders(),
  });
  assertOk(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchStockHistory(): Promise<ProductStockHistory[]> {
  const res = await fetch(`${API_BASE}/Api/products/report/stockhistory`, {
    headers: getAuthHeaders(),
  });
  assertOk(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function downloadFile(url: string, filename: string): Promise<void> {
  const res = await fetch(`${API_BASE}${url}`, { headers: getDownloadHeaders() });
  if (!res.ok) throw new Error(`Gagal export: HTTP ${res.status}`);
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}