'use client';

import { useUnitBisnis } from './useUnitBisnis';
import { ForbiddenPage } from '@/app/components/laporan/ForbiddenPage';
import { UnitBisnisHeader } from '@/app/components/bussines/UnitBisnisHeader';
import { UnitBisnisCard } from '@/app/components/bussines/UnitBisnisCard';
import { UnitBisnisModal } from '@/app/components/bussines/UnitBisnisModal';
import { Building2 } from 'lucide-react';

export default function UnitBisnisPage() {
  const {
    units,
    loading,
    role,
    roleLoading,
    showModal,
    editingUnit,
    form,
    setForm,
    error,
    success,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  } = useUnitBisnis();

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

  // Guard: bukan Owner
  if (role !== 'Owner') return <ForbiddenPage role={role ?? 'unknown'} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <UnitBisnisHeader onAdd={openCreateModal} />

      {/* Notifications */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 space-y-2">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
            {success}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {loading ? (
          <LoadingState />
        ) : units.length === 0 ? (
          <EmptyState onAdd={openCreateModal} />
        ) : (
          units.map((unit) => (
            <UnitBisnisCard
              key={unit.id}
              unit={unit}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showModal && (
        <UnitBisnisModal
          editingUnit={editingUnit}
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="col-span-full text-center py-16">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 animate-pulse" />
      <p className="text-zinc-500">Memuat data...</p>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="col-span-full text-center py-16">
      <Building2 className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
      <p className="text-zinc-500 text-lg">Belum ada unit bisnis</p>
      <button
        onClick={onAdd}
        className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors text-sm"
      >
        Tambah Pertama
      </button>
    </div>
  );
}