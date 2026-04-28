import { X, ChevronDown } from 'lucide-react';
import type { WarehouseData, Tenant, WarehouseForm } from '@/app/admin/gudang/types';

interface GudangModalProps {
  editTarget: WarehouseData | null;
  form: WarehouseForm;
  tenants: Tenant[];
  saving: boolean;
  onChange: (form: WarehouseForm) => void;
  onSave: () => void;
  onClose: () => void;
}

export function GudangModal({
  editTarget,
  form,
  tenants,
  saving,
  onChange,
  onSave,
  onClose,
}: GudangModalProps) {
  const isValid = form.name.trim() && form.location.trim() && form.tenant_id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            {editTarget ? 'Edit Gudang' : 'Tambah Gudang'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Nama Gudang <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="Gudang Utama"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Lokasi <span className="text-red-400">*</span>
            </label>
            <input
              value={form.location}
              onChange={(e) => onChange({ ...form, location: e.target.value })}
              placeholder="Bandung"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Unit Bisnis <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.tenant_id}
                onChange={(e) => onChange({ ...form, tenant_id: Number(e.target.value) })}
                className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 pr-10"
              >
                <option value={0} disabled>-- Pilih Unit Bisnis --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.business_name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
            {tenants.length === 0 && (
              <p className="text-xs text-yellow-500 mt-1">
                Tidak ada unit bisnis. Tambahkan dulu di menu Unit Bisnis.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || !isValid}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}