import type { UserProfile, ProfileForm } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getUserId(): string {
  return typeof window !== 'undefined' ? (localStorage.getItem('user_id') ?? '') : '';
}

export async function fetchUserProfile(): Promise<UserProfile> {
  // Coba endpoint tanpa id dulu, fallback ke endpoint dengan id
  try {
    const res = await fetch(`${API_BASE}/Api/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/Api/profile/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
}

export async function updateUserProfile(
  userId: number,
  form: ProfileForm
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/Api/profile/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}