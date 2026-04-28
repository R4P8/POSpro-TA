'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RegisterAlert from '@/app/components/ui/auth/RegisterAlert';
import LoginSubmitButton from '@/app/components/ui/auth/LoginSubmitButton';
import type { LoginFormData } from '@/app/login/LoginPage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginFormProps {
  formData: LoginFormData;
  loading: boolean;
  error: string;
  success: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INPUT_BASE =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SocialButton({ icon, label, disabled }: { icon: React.ReactNode; label: string; disabled: boolean }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoginForm({
  formData,
  loading,
  error,
  success,
  onChange,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Selamat Datang</h2>
          <p className="text-gray-400">Login untuk melanjutkan ke dashboard</p>
        </motion.div>

        {/* Reuse RegisterAlert — props are identical */}
        <RegisterAlert error={error} success={success} />

        <form onSubmit={onSubmit} className="space-y-5">

          {/* Email */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email" id="email" name="email"
              value={formData.email} onChange={onChange}
              required disabled={isDisabled}
              className={INPUT_BASE} placeholder="email@example.com" autoComplete="email"
            />
          </motion.div>

          {/* Role */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Role <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                id="role" name="role"
                value={formData.role} onChange={onChange}
                disabled={isDisabled}
                className={`${INPUT_BASE} appearance-none text-white`}
              >
                <option value="" disabled className="bg-zinc-900 text-gray-400">Pilih Role</option>
                <option value="Owner"  className="bg-zinc-900">👑 Owner</option>
                <option value="Kasir"  className="bg-zinc-900">🧾 Kasir</option>
                <option value="Gudang" className="bg-zinc-900">📦 Gudang</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password" name="password"
                value={formData.password} onChange={onChange}
                required disabled={isDisabled}
                className={INPUT_BASE} placeholder="••••••••" autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isDisabled} tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </motion.div>

          {/* Remember me + Forgot password */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" name="rememberMe"
                checked={formData.rememberMe} onChange={onChange}
                disabled={isDisabled}
                className="w-4 h-4 accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-300">Ingat saya</span>
            </label>
            <motion.a href="#" whileHover={{ scale: 1.05 }} className="text-sm text-purple-400 hover:text-purple-300">
              Lupa password?
            </motion.a>
          </motion.div>

          <LoginSubmitButton loading={loading} success={!!success} />

          {/* Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0a] text-gray-400">Atau login dengan</span>
            </div>
          </motion.div>

          {/* Social login */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            <SocialButton disabled={isDisabled} label="Google" icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            } />
            <SocialButton disabled={isDisabled} label="Microsoft" icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.4 2H2v9.4h9.4V2zm10.6 0h-9.4v9.4H22V2zM11.4 12.6H2V22h9.4v-9.4zm10.6 0h-9.4V22H22v-9.4z"/>
              </svg>
            } />
          </motion.div>

          {/* Footer */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-center text-sm text-gray-400"
          >
            Belum punya akun?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
              Daftar gratis
            </Link>
          </motion.p>

        </form>
      </div>
    </div>
  );
}