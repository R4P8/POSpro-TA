import type { WarehouseData, Tenant, WarehouseForm } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function assertOk(res: Response) {
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function fetchRole(): Promise<string> {
  const res = await fetch(`${API_BASE}/Api/profile`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Gagal mengambil role');
  const data = await res.json();
  return data?.role ?? '';
}

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch(`${API_BASE}/api/tenants`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchWarehouses(): Promise<WarehouseData[]> {
  const res = await fetch(`${API_BASE}/Api/warehouses`, { headers: getAuthHeaders() });
  assertOk(res);
  const data = await res.json();
  return data ?? [];
}

export async function createWarehouse(form: WarehouseForm): Promise<void> {
  const res = await fetch(`${API_BASE}/Api/warehouses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  assertOk(res);
}

export async function updateWarehouse(id: number, form: WarehouseForm): Promise<void> {
  const res = await fetch(`${API_BASE}/Api/warehouses/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  assertOk(res);
}

export async function deleteWarehouse(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/Api/warehouses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (res.status === 401) throw new Error('Sesi habis, silakan login ulang');
  if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
}