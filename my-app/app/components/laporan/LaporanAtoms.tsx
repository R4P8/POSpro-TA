import { RefreshCw, Download, ChevronDown, FileDown, FileSpreadsheet } from 'lucide-react';

// ─── SummaryCard ──────────────────────────────────────────────────────────────
interface SummaryCardProps {
  label: string;
  value: string;
  color?: string;
}

export function SummaryCard({ label, value, color }: SummaryCardProps) {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-3 sm:p-4">
      <p className="text-xs text-zinc-500 mb-1 leading-tight">{label}</p>
      <p className={`font-bold text-sm sm:text-base truncate ${color ?? 'text-white'}`}>{value}</p>
    </div>
  );
}

// ─── LoadingState ─────────────────────────────────────────────────────────────
export function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-36 text-zinc-500 gap-3">
      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// ─── ErrorState ───────────────────────────────────────────────────────────────
export function ErrorState({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-center">
      <p className="text-red-400 font-medium text-sm">Gagal memuat: {msg}</p>
      <button onClick={onRetry} className="mt-2 text-xs text-red-400 hover:text-red-300 underline">
        Coba lagi
      </button>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-36 text-zinc-600 gap-2">
      <Icon className="w-9 h-9" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

// ─── ExportDropdown ───────────────────────────────────────────────────────────
interface ExportDropdownProps {
  show: boolean;
  onToggle: () => void;
  loading: boolean;
  label: string;
  onCsv: () => void;
  onExcel: () => void;
}

export function ExportDropdown({ show, onToggle, loading, label, onCsv, onExcel }: ExportDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 rounded-xl transition-colors text-xs sm:text-sm font-medium"
      >
        {loading
          ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          : <Download className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{loading ? 'Mengunduh...' : 'Export'}</span>
        {!loading && <ChevronDown className="w-3 h-3" />}
      </button>

      {show && !loading && (
        <div className="absolute right-0 mt-2 w-52 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-xl">
          <div className="px-3 py-2 border-b border-zinc-700">
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
          <button
            onClick={onCsv}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 transition-colors text-sm"
          >
            <FileDown className="w-4 h-4 text-green-400" /> Export CSV
          </button>
          <button
            onClick={onExcel}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 transition-colors text-sm border-t border-zinc-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel (.xlsx)
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SearchRefresh ────────────────────────────────────────────────────────────
import { Search } from 'lucide-react';

interface SearchRefreshProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function SearchRefresh({ value, onChange, placeholder, onRefresh, isLoading }: SearchRefreshProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm"
        />
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors text-sm disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}