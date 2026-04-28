'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { Settings as SettingsIcon, Bell, Lock, Database, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      
      <main className={`flex-1 overflow-auto transition-all duration-300`}>
        <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-8 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-purple-400" />
            Settings
          </h1>
          <p className="text-zinc-400 mt-1">Pengaturan sistem dan preferensi</p>
        </header>

        <div className="p-8 space-y-6 max-w-4xl">
          {[
            { icon: Bell, title: 'Notifikasi', desc: 'Atur preferensi notifikasi' },
            { icon: Lock, title: 'Keamanan', desc: 'Password dan autentikasi' },
            { icon: Database, title: 'Data & Backup', desc: 'Kelola data dan backup' },
            { icon: Palette, title: 'Tampilan', desc: 'Kustomisasi tampilan aplikasi' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">{item.title}</h3>
                      <p className="text-sm text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-zinc-600 group-hover:text-purple-400 transition-colors">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}