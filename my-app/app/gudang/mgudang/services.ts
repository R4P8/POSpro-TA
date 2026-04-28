import { API_BASE, getAuthHeaders } from './utils';
import type { WarehouseData, Tenant, WarehouseForm } from '@/app/admin/gudang/types';

export async function fetchWarehouses(): Promise<WarehouseData[]> {
  const res = await fetch(`${API_BASE}/Api/warehouses`, { headers: getAuthHeaders() });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data ?? [];
}

export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tenants`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchRole(): Promise<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  if (!token) return '';
  try {
    const res = await fetch(`${API_BASE}/Api/profile`, { headers: getAuthHeaders() });
    if (!res.ok) return '';
    const data = await res.json();
    return data?.role ?? '';
  } catch {
    return '';
  }
}

export async function saveWarehouse(form: WarehouseForm, editId?: number): Promise<void> {
  const url = editId
    ? `${API_BASE}/Api/warehouses/${editId}`
    : `${API_BASE}/Api/warehouses`;
  const res = await fetch(url, {
    method: editId ? 'PUT' : 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteWarehouse(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/Api/warehouses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
}