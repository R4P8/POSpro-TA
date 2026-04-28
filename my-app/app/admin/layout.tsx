'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { Sparkles, ShieldX, LogIn } from 'lucide-react';

interface UserProfile {
  ID_User: number;
  full_name: string;
  Email: string;
  role: string;
  Status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authState, setAuthState] = useState<'loading' | 'unauthorized' | 'authenticated'>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token) {
      setAuthState('unauthorized');
      return;
    }

    if (role !== 'Owner') {
    setAuthState('unauthorized');
    return;
  }
    setAuthState('authenticated');

    fetch(`${API_BASE}/Api/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : null)
      .then((data: UserProfile | null) => {
        if (data) setUser(data);
      })
      .catch(() => {});
  }, [pathname, router]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (authState === 'loading') {
    return (
      <div className="flex h-screen bg-zinc-950 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-2xl animate-pulse">
            P
          </div>
          <p className="text-zinc-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // ── Unauthorized ─────────────────────────────────────────────────────────
  if (authState === 'unauthorized') {
    return (
      <div className="flex h-screen bg-zinc-950 items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          {/* Icon */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center border border-red-500/20">
              <ShieldX className="w-12 h-12 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full" />
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Sesi Anda telah berakhir atau Anda belum masuk. Silakan login untuk melanjutkan.
            </p>
          </div>

          {/* Countdown */}
          <RedirectCountdown onRedirect={() => router.push('/login')} />

          {/* Button */}
          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold transition-all text-white"
          >
            <LogIn className="w-4 h-4" />
            Login Sekarang
          </button>

          <p className="text-zinc-700 text-xs">
            © {new Date().getFullYear()} POSPro
          </p>
        </div>
      </div>
    );
  }

  // ── Authenticated ─────────────────────────────────────────────────────────
  const isAdminIndex = pathname === '/admin';

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {isAdminIndex ? <WelcomePage user={user} /> : children}
      </main>
    </div>
  );
}

// ─── Countdown redirect ───────────────────────────────────────────────────────
function RedirectCountdown({ onRedirect }: { onRedirect: () => void }) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0) { onRedirect(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onRedirect]);

  return (
    <div className="flex items-center gap-2 text-zinc-500 text-sm">
      <div className="w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center font-bold text-white text-sm">
        {count}
      </div>
      <span>Mengalihkan ke halaman login...</span>
    </div>
  );
}

// ─── Welcome Page ─────────────────────────────────────────────────────────────
function WelcomePage({ user }: { user: UserProfile | null }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="px-10 pt-14 pb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-zinc-500 font-medium">POSPro Dashboard</span>
        </div>

        {user ? (
          <>
            <h1 className="text-4xl font-bold leading-tight">
              Selamat datang kembali,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user.full_name}
              </span>{' '}
              👋
            </h1>
            <p className="text-zinc-500 mt-2 text-lg">
              Anda masuk sebagai{' '}
              <span className="text-purple-400 font-semibold">{user.role}</span>
            </p>
          </>
        ) : (
          <>
            <div className="h-10 w-72 bg-zinc-800 rounded-xl animate-pulse mb-3" />
            <div className="h-5 w-48 bg-zinc-800 rounded-lg animate-pulse" />
          </>
        )}
      </header>

      <div className="flex-1 flex items-end px-10 pb-10">
        <p className="text-zinc-800 text-sm">
          © {new Date().getFullYear()} POSPro · Semua hak cipta dilindungi
        </p>
      </div>
    </div>
  );
}