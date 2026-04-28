'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginLeftSide from '@/app/components/ui/auth/LoginLeftSide';
import LoginForm from '@/app/components/ui/auth/LoginForm';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  role: string;
  password: string;
  rememberMe: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM: LoginFormData = {
  email: '',
  role: '',
  password: '',
  rememberMe: false,
};

const ROLE_ROUTES: Record<string, string> = {
  Owner:  '/admin',
  Kasir:  '/kasir',
  Gudang: '/gudang',
};

const ROLE_LABELS: Record<string, string> = {
  Owner:  'Owner — menuju Dashboard',
  Kasir:  'Kasir — menuju halaman POS',
  Gudang: 'Gudang — menuju halaman Gudang',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(data: LoginFormData): string {
  if (!data.email.trim())    return 'Email harus diisi';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Format email tidak valid';
  if (!data.role)            return 'Role harus dipilih';
  if (!data.password.trim()) return 'Password harus diisi';
  return '';
}

function mapError(message: string): string {
  if (message.includes('invalid credentials') || message.includes('Unauthorized'))
    return 'Email atau password salah';
  if (message.includes('Failed to fetch'))
    return 'Tidak dapat terhubung ke server';
  return message || 'Terjadi kesalahan. Silakan coba lagi.';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error)   setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate(formData);
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const responseText = await response.text();
      let data: { token?: string; id?: string; email?: string; role?: string; message?: string };
      try { data = JSON.parse(responseText); }
      catch { data = { message: responseText }; }

      if (!response.ok) throw new Error(data.message || 'Login gagal');
      if (!data.token)  throw new Error('Token tidak ditemukan dalam response');

      // Persist session
      localStorage.setItem('token',     data.token);
      localStorage.setItem('userId',    data.id    ?? '');
      localStorage.setItem('userEmail', data.email ?? '');
      localStorage.setItem('userRole',  data.role  ?? '');
      if (formData.rememberMe) localStorage.setItem('rememberMe', 'true');

      const role       = data.role ?? '';
      const roleLabel  = ROLE_LABELS[role] ?? 'menuju halaman utama';
      setSuccess(`Login berhasil sebagai ${roleLabel}...`);

      setTimeout(() => router.push(ROLE_ROUTES[role] ?? '/admin'), 2000);
    } catch (err: any) {
      setError(mapError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <LoginLeftSide />
      <LoginForm
        formData={formData}
        loading={loading}
        error={error}
        success={success}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}