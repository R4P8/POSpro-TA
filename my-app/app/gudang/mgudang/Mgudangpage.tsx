'use client';

import { useMGudang } from './Usemgudang';
import { RoleLoadingState, ForbiddenPage, LoadingState, ErrorState, EmptyState } from '@/app/components/warehouse/MGudangAtoms';
import { GudangHeader }  from '@/app/components/warehouse/GudangHeader';
import { GudangModal }   from '@/app/components/warehouse/GudangModal';
import WarehouseList     from '@/app/components/warehouse/Warehouselist';

export default function MGudangPage() {
  const g = useMGudang();

  if (g.roleLoading) return <RoleLoadingState />;
  if (!g.canAccess)  return <ForbiddenPage role={g.role ?? 'unknown'} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 overflow-auto">
        <GudangHeader onAdd={g.openCreate} />

        <div className="p-4 sm:p-6 lg:p-8">
          {g.loading && <LoadingState />}

          {!g.loading && g.error && (
            <ErrorState message={g.error} onRetry={g.loadWarehouses} />
          )}

          {!g.loading && !g.error && g.warehouses.length === 0 && (
            <EmptyState onAdd={g.openCreate} />
          )}

          {!g.loading && !g.error && g.warehouses.length > 0 && (
            <WarehouseList
              warehouses={g.warehouses}
              deleteId={g.deleteId}
              getTenantName={g.getTenantName}
              onEdit={g.openEdit}
              onDeleteRequest={(id) => g.setDeleteId(id)}
              onDeleteConfirm={g.handleDelete}
              onDeleteCancel={() => g.setDeleteId(null)}
            />
          )}
        </div>
      </main>

      {g.showModal && (
        <GudangModal
          editTarget={g.editTarget}
          form={g.form}
          tenants={g.tenants}
          saving={g.saving}
          onClose={g.closeModal}
          onSave={g.handleSave}
          onChange={g.setForm}
        />
      )}
    </div>
  );
}