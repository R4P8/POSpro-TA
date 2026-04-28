'use client';

import { RefreshCw } from 'lucide-react';
import { formatDateLong } from '@/app/admin/dashboard/utils';

interface DashboardHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function DashboardHeader({ isLoading, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Dashboard Overview
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white disabled:opacity-50 transition-colors px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <div className="text-right hidden sm:block">
            <p className="text-sm text-zinc-400">Hari ini</p>
            <p className="font-semibold text-sm">{formatDateLong()}</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold flex-shrink-0">
            O
          </div>
        </div>
      </div>
    </header>
  );
}