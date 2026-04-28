import { API_BASE, getAuthHeaders } from './utils';
import type { Product, Warehouse, ProductForm } from './types';

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

export async function saveProduct(form: ProductForm, editId?: number): Promise<void> {
  const url = editId ? `${API_BASE}/Api/product/${editId}` : `${API_BASE}/Api/product`;
  const res = await fetch(url, {
    method: editId ? 'PUT' : 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/Api/product/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
}