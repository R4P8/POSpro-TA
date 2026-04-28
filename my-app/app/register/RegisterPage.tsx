'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterLeftSide from '@/app/components/ui/auth/RegisterLeftSide';
import RegisterForm from '@/app/components/ui/auth/RegisterForm';

interface FormData {
  fullName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: '',
};

const ERROR_MAP: Record<string, string> = {
  'all fields':        'Semua field harus diisi',
  'email already exists': 'Email sudah terdaftar',
  'already registered':   'Email sudah terdaftar',
  password:            'Password tidak memenuhi syarat',
};

function mapError(message: string): string {
  for (const [key, label] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return label;
  }
  return message || 'Terjadi kesalahan. Silakan coba lagi.';
}

function validate(data: FormData): string {
  if (!data.fullName.trim())  return 'Nama lengkap harus diisi';
  if (!data.email.trim())     return 'Email harus diisi';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Format email tidak valid';
  if (!data.role)             return 'Role harus dipilih';
  if (data.password.length < 8) return 'Password harus minimal 8 karakter';
  if (data.password !== data.confirmPassword) return 'Password dan konfirmasi password tidak cocok';
  return '';
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email:     formData.email,
          role:      formData.role,
          password:  formData.password,
        }),
      });

      const responseText = await response.text();
      let data: { message?: string; error?: string };
      try { data = JSON.parse(responseText); }
      catch { data = { message: responseText }; }

      if (!response.ok) {
        throw new Error(data.message || data.error || responseText || 'Registrasi gagal');
      }

      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(mapError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <RegisterLeftSide />
      <RegisterForm
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