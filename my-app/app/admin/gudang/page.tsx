'use client';

import { Warehouse, Plus } from 'lucide-react';
import { useGudang } from './useGudang';
import { ForbiddenPage } from '@/app/components/laporan/ForbiddenPage';
import { GudangHeader } from '@/app/components/warehouse/GudangHeader';
import { WarehouseCard } from '@/app/components/warehouse/WarehouseCard';
import { GudangModal } from '@/app/components/warehouse/GudangModal';

export default function GudangPage() {
  const {
    warehouses,
    tenants,
    loading,
    error,
    role,
    roleLoading,
    showModal,
    editTarget,
    form,
    setForm,
    saving,
    deleteId,
    setDeleteId,
    getTenantName,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
    loadWarehouses,
  } = useGudang();

  // Guard: loading role
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  // Guard: role tidak diizinkan
  if (role !== 'Owner' && role !== 'Gudang') {
    return <ForbiddenPage role={role ?? 'unknown'} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <GudangHeader onAdd={openCreate} />

      <div className="p-4 sm:p-6 lg:p-8">
        {loading && <LoadingState />}

        {!loading && error && (
          <ErrorState message={error} onRetry={loadWarehouses} />
        )}

        {!loading && !error && warehouses.length === 0 && (
          <EmptyState onAdd={openCreate} />
        )}

        {!loading && !error && warehouses.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {warehouses.map((w) => (
              <WarehouseCard
                key={w.id}
                warehouse={w}
                tenantName={getTenantName(w.tenant_id)}
                deleteId={deleteId}
                onEdit={openEdit}
                onDeleteRequest={setDeleteId}
                onDeleteConfirm={handleDelete}
                onDeleteCancel={() => setDeleteId(null)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <GudangModal
          editTarget={editTarget}
          form={form}
          tenants={tenants}
          saving={saving}
          onChange={setForm}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// ─── Inline states (kecil, tidak perlu file terpisah) ─────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-48 text-zinc-500">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
      Memuat data gudang...
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-6 text-center">
      <p className="text-red-400 font-semibold">Gagal memuat data</p>
      <p className="text-zinc-500 text-sm mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-xl text-sm"
      >
        Coba Lagi
      </button>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
      <Warehouse className="w-12 h-12 mb-3 text-zinc-700" />
      <p className="text-sm text-center">Belum ada gudang. Tambahkan gudang pertama Anda.</p>
      <button
        onClick={onAdd}
        className="mt-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-semibold text-sm"
      >
        <Plus className="w-4 h-4" />
        Tambah Gudang
      </button>
    </div>
  );
}