import type { TabId } from '@/app/admin/laporan/types';
import { TABS } from '@/app/admin/laporan/constants';

interface TabBarProps {
  activeTab: TabId;
  onChange: (id: TabId) => void;
}

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{tab.short}</span>
            <span className="sm:hidden text-[10px] leading-tight text-center">{tab.short}</span>
          </button>
        );
      })}
    </div>
  );
}