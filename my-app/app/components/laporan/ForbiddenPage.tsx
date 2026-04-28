import { ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForbiddenPageProps {
  role: string;
}

export function ForbiddenPage({ role }: ForbiddenPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center border border-red-500/20">
            <ShieldX className="w-12 h-12 text-red-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Halaman <span className="text-white font-semibold">Manajemen Gudang</span> hanya dapat
            diakses oleh <span className="text-purple-400 font-semibold">Owner</span> atau{' '}
            <span className="text-orange-400 font-semibold">Gudang</span>.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg">
            <span className="text-xs text-zinc-500">Role Anda:</span>
            <span className="text-xs font-semibold text-orange-400 capitalize">{role}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/admin')}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold transition-all text-white text-sm"
        >
          Kembali ke Dashboard
        </button>

        <p className="text-zinc-700 text-xs">
          Hubungi Owner jika Anda membutuhkan akses ke halaman ini.
        </p>
      </div>
    </div>
  );
}