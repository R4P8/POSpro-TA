import { X } from 'lucide-react';
import type { UnitBisnis, UnitBisnisForm } from '@/app/admin/unit-bisnis/types';

interface UnitBisnisModalProps {
  editingUnit: UnitBisnis | null;
  form: UnitBisnisForm;
  onChange: (form: UnitBisnisForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function UnitBisnisModal({
  editingUnit,
  form,
  onChange,
  onSubmit,
  onClose,
}: UnitBisnisModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            {editingUnit ? 'Edit Unit Bisnis' : 'Tambah Unit Bisnis'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Bisnis <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.business_name}
              onChange={(e) => onChange({ ...form, business_name: e.target.value })}
              placeholder="Outlet Pusat"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Alamat <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.alamat}
              onChange={(e) => onChange({ ...form, alamat: e.target.value })}
              placeholder="Jl. Merdeka No. 10, Bandung"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Jumlah Karyawan <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.karyawan}
              onChange={(e) => onChange({ ...form, karyawan: parseInt(e.target.value) || 0 })}
              placeholder="12"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => onChange({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors text-sm"
            >
              {editingUnit ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}