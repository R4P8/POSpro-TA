import { Calendar, X } from 'lucide-react';
import { today, daysAgo } from '@/app/admin/laporan/utils';
import { DATE_PRESETS } from '@/app/admin/laporan/constants';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  showModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

export function DateFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  showModal,
  onOpenModal,
  onCloseModal,
}: DateFilterProps) {
  function applyPreset(days: number) {
    onStartChange(daysAgo(days));
    onEndChange(today);
  }

  function isPresetActive(days: number) {
    return startDate === daysAgo(days) && endDate === today;
  }

  return (
    <>
      {/* Mobile pill trigger */}
      <button
        onClick={onOpenModal}
        className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-medium text-zinc-300 whitespace-nowrap"
      >
        <Calendar className="w-3 h-3 text-purple-400" />
        {startDate.slice(5).replace('-', '/')} – {endDate.slice(5).replace('-', '/')}
      </button>

      {/* Desktop date range */}
      <div className="hidden sm:flex gap-3 items-end">
        <div className="flex items-end gap-2 flex-1">
          <Calendar className="w-4 h-4 text-zinc-500 flex-shrink-0 mb-2.5" />
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Dari</label>
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => onStartChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
              />
            </div>
            <span className="text-zinc-600 mb-0.5">—</span>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Sampai</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={today}
                onChange={(e) => onEndChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          {DATE_PRESETS.map(({ label, days }) => (
            <button
              key={label}
              onClick={() => applyPreset(days)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isPresetActive(days)
                  ? 'bg-purple-500 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:hidden"
          onClick={onCloseModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-zinc-900 border-t border-zinc-800 w-full rounded-t-3xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto -mt-1 mb-2" />
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filter Tanggal</h3>
              <button onClick={onCloseModal} className="p-1.5 bg-zinc-800 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Dari</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => onStartChange(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Sampai</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={today}
                  onChange={(e) => onEndChange(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {DATE_PRESETS.map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => applyPreset(days)}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isPresetActive(days)
                      ? 'bg-purple-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onCloseModal}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-sm font-semibold transition-all"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </>
  );
}