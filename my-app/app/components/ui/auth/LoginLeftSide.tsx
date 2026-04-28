'use client';

import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

const FEATURES = [
  { icon: '📊', text: 'Dashboard real-time analytics' },
  { icon: '🔒', text: 'Keamanan data terjamin' },
  { icon: '⚡', text: 'Akses cepat dari mana saja' },
  { icon: '💬', text: 'Support 24/7 siap membantu' },
];

// ─── Counter component ────────────────────────────────────────────────────────

interface CounterProps {
  to:     number;
  suffix: string;
  color:  string;
}

function Counter({ to, suffix, color }: CounterProps) {
  const ref        = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true });
  const motionVal  = useMotionValue(0);
  const spring     = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const display    = useTransform(spring, (v) =>
    to < 100
      ? v.toFixed(1)           // 99.9%
      : Math.round(v).toLocaleString('id-ID'), // 5,000+
  );

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, motionVal, to]);

  return (
    <div ref={ref} className={`text-3xl font-bold mb-2 ${color}`}>
      <motion.span>{display}</motion.span>
      {suffix}
    </div>
  );
}

// ─── Stats data ───────────────────────────────────────────────────────────────

const STATS = [
  { to: 5000, suffix: '+', label: 'Bisnis Aktif', color: 'text-purple-400' },
  { to: 99.9, suffix: '%', label: 'Uptime',       color: 'text-blue-400'   },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function LoginLeftSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f23] to-[#0a0a0a] p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-2xl">
            P
          </div>
          <span className="text-3xl font-bold tracking-tight">
            POS<span className="text-purple-400">Pro</span>
          </span>
        </Link>

        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
            ✨ Selamat Datang Kembali
          </div>

          <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
            Lanjutkan
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Kesuksesan Bisnis
            </span>
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed">
            Login untuk mengakses dashboard dan kelola bisnis Anda dengan lebih efisien.
          </p>

          {/* Animated stats grid */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <Counter to={stat.to} suffix={stat.suffix} color={stat.color} />
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Feature list */}
          <div className="space-y-4 pt-8 mb-5">
            {FEATURES.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <span className="text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Lebih dari 1 juta transaksi</div>
          <p className="text-sm text-gray-400">diproses setiap bulan dengan POSPro</p>
        </div>
      </motion.div>
    </div>
  );
}