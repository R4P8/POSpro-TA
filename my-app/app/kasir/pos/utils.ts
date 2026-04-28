export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getUserId(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('userId') ?? '0');
}

export const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export const generateInvoice = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `INV-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Date.now().toString().slice(-5)}`;
};