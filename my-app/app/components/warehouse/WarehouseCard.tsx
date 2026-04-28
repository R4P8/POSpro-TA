import { Warehouse, Building2, Pencil, Trash2, Check, X } from 'lucide-react';
import type { WarehouseData } from '@/app/admin/gudang/types';

interface WarehouseCardProps {
  warehouse: WarehouseData;
  tenantName: string;
  deleteId: number | null;
  onEdit: (w: WarehouseData) => void;
  onDeleteRequest: (id: number) => void;
  onDeleteConfirm: (id: number) => void;
  onDeleteCancel: () => void;
}

export function WarehouseCard({
  warehouse: w,
  tenantName,
  deleteId,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: WarehouseCardProps) {
  const isPendingDelete = deleteId === w.id;

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-4 sm:p-6 border border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Identity */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold">{w.name}</h3>
          <p className="text-zinc-500 text-xs sm:text-sm">{w.location}</p>
        </div>
      </div>

      {/* Meta + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        {/* Tenant */}
        <div className="flex items-center gap-2 sm:block">
          <Building2 className="w-4 h-4 text-zinc-600 sm:hidden" />
          <div>
            <p className="text-xs text-zinc-600 hidden sm:block">Unit Bisnis</p>
            <p className="text-zinc-300 text-xs sm:text-sm font-medium">{tenantName}</p>
          </div>
        </div>

        {/* Updated at */}
        {w.updated_at && (
          <div className="text-right hidden lg:block">
            <p className="text-xs text-zinc-600">Diperbarui</p>
            <p className="text-zinc-400 text-sm">
              {new Date(w.updated_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 self-end sm:self-center">
          <button
            onClick={() => onEdit(w)}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-blue-600/30 hover:text-blue-400 transition-colors text-zinc-400"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {isPendingDelete ? (
            <div className="flex gap-1">
              <button
                onClick={() => onDeleteConfirm(w.id)}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onDeleteCancel}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onDeleteRequest(w.id)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-600/30 hover:text-red-400 transition-colors text-zinc-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}