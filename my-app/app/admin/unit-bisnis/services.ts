import type { UnitBisnis, UnitBisnisForm } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchRole(): Promise<string> {
  const res = await fetch(`${API_BASE}/Api/profile`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Gagal mengambil role');
  const data = await res.json();
  return data?.role ?? '';
}

export async function fetchUnits(): Promise<UnitBisnis[]> {
  const res = await fetch(`${API_BASE}/api/tenants`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Gagal mengambil data');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createUnit(form: UnitBisnisForm): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tenants`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({ message: 'Gagal menyimpan' }));
    throw new Error(d.message || 'Gagal menyimpan');
  }
}

export async function updateUnit(id: number, form: UnitBisnisForm): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tenants/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({ message: 'Gagal mengupdate' }));
    throw new Error(d.message || 'Gagal mengupdate');
  }
}

export async function deleteUnit(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tenants/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus');
}