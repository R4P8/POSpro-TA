'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RegisterAlert from '@/app/components/ui/auth/RegisterAlert';
import RegisterSubmitButton from '@/app/components/ui/auth/RegisterSubmitButton';

// Types 

export interface RegisterFormData {
  fullName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  formData: RegisterFormData;
  loading: boolean;
  error: string;
  success: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Constants 

const INPUT_BASE =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

// Sub-components

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function PasswordToggle({
  show,
  onToggle,
  disabled,
}: {
  show: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      disabled={disabled}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
    >
      <EyeIcon open={show} />
    </button>
  );
}

//  Main Component
export default function RegisterForm({
  formData,
  loading,
  error,
  success,
  onChange,
  onSubmit,
}: RegisterFormProps) {
  const [showPassword, setShowPassword]             = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDisabled = loading || !!success;

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">

        {/* Mobile-only logo */}
        <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-xl">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight">
            POS<span className="text-purple-400">Pro</span>
          </span>
        </Link>

        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Daftar Akun Baru</h2>
          <p className="text-gray-400">Isi form di bawah untuk membuat akun POSPro</p>
        </div>

        <RegisterAlert error={error} success={success} />

        <form onSubmit={onSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Nama Lengkap <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              required
              disabled={isDisabled}
              className={INPUT_BASE}
              placeholder="Masukkan nama lengkap Anda"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              disabled={isDisabled}
              className={INPUT_BASE}
              placeholder="email@contoh.com"
              autoComplete="email"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Role <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={onChange}
                required
                disabled={isDisabled}
                className={`${INPUT_BASE} appearance-none text-white`}
              >
                <option value="" disabled className="bg-zinc-900 text-gray-400">Pilih Role</option>
                <option value="Kasir"  className="bg-zinc-900">🧾 Kasir</option>
                <option value="Gudang" className="bg-zinc-900">📦 Gudang</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {formData.role && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              />
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
                disabled={isDisabled}
                minLength={8}
                className={INPUT_BASE}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
              />
              <PasswordToggle
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                disabled={isDisabled}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Minimal 8 karakter dengan kombinasi huruf dan angka
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Konfirmasi Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                required
                disabled={isDisabled}
                minLength={8}
                className={INPUT_BASE}
                placeholder="Ulangi password"
                autoComplete="new-password"
              />
              <PasswordToggle
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((v) => !v)}
                disabled={isDisabled}
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              disabled={isDisabled}
              className="mt-1 w-4 h-4 accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              Saya setuju dengan{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">syarat & ketentuan</a>{' '}
              dan{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">kebijakan privasi</a>{' '}
              <span className="text-red-400">*</span>
            </label>
          </div>

          <RegisterSubmitButton loading={loading} success={!!success} />

          <p className="text-center text-sm text-gray-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Login di sini
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}