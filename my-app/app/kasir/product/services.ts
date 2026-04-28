import { API_BASE, getAuthHeaders } from './utils';

export interface Product {
  id: number;
  id_warehouse: number;
  name: string;
  sku: string;
  price_buy: number;
  price_sell: number;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  user_insert?: number;
  user_update?: number;
}

export interface Warehouse {
  id: number;
  name: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/Api/product`, { headers: getAuthHeaders() });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data ?? [];
}

export async function fetchWarehouses(): Promise<Warehouse[]> {
  const res = await fetch(`${API_BASE}/Api/warehouses`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}