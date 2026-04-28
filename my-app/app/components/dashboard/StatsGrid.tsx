'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { StatCard } from '@/app/admin/dashboard/types';

export default function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="group relative bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 md:p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:scale-105"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color}-400`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs md:text-sm font-semibold ${stat.isPositive ? 'text-green-400' : 'text-orange-400'}`}>
                  {stat.isPositive
                    ? <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                    : <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-zinc-400 text-xs md:text-sm font-medium mb-1 leading-tight">{stat.title}</h3>
              <p className="text-lg md:text-2xl font-bold truncate">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}