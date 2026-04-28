import { MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import type { UnitBisnis } from '@/app/admin/unit-bisnis/types';

interface UnitBisnisCardProps {
  unit: UnitBisnis;
  onEdit: (unit: UnitBisnis) => void;
  onDelete: (id: number) => void;
}

export function UnitBisnisCard({ unit, onEdit, onDelete }: UnitBisnisCardProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 sm:p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all group relative">
      {/* Desktop hover actions */}
      <div className="absolute top-4 right-4 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(unit)}
          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4 text-blue-400" />
        </button>
        <button
          onClick={() => onDelete(unit.id)}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold group-hover:text-purple-400 transition-colors pr-16 break-words">
          {unit.business_name}
        </h3>
        <span
          className={`px-2 py-0.5 rounded-lg text-xs font-semibold flex-shrink-0 ${
            unit.status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-zinc-500/20 text-zinc-400'
          }`}
        >
          {unit.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm break-words">{unit.alamat}</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold text-white">{unit.karyawan}</span> Karyawan
          </p>
        </div>
      </div>

      {/* Mobile actions */}
      <div className="sm:hidden flex gap-2 mt-3 pt-3 border-t border-zinc-800/50">
        <button
          onClick={() => onEdit(unit)}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-xs"
        >
          <Edit2 className="w-3.5 h-3.5 text-blue-400" /> Edit
        </button>
        <button
          onClick={() => onDelete(unit.id)}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-xs"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" /> Hapus
        </button>
      </div>
    </div>
  );
}