'use client';

import { WarehouseCard } from '@/app/components/warehouse/WarehouseCard';
import type { WarehouseData } from '@/app/admin/gudang/types';

interface WarehouseListProps {
  warehouses:      WarehouseData[];
  deleteId:        number | null;
  getTenantName:   (id: number) => string;
  onEdit:          (w: WarehouseData) => void;
  onDeleteRequest: (id: number) => void;
  onDeleteConfirm: (id: number) => void;
  onDeleteCancel:  () => void;
}

export default function WarehouseList({
  warehouses,
  deleteId,
  getTenantName,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: WarehouseListProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {warehouses.map(w => (
        <WarehouseCard
          key={w.id}
          warehouse={w}
          tenantName={getTenantName(w.tenant_id)}
          deleteId={deleteId}
          onEdit={onEdit}
          onDeleteRequest={onDeleteRequest}
          onDeleteConfirm={onDeleteConfirm}
          onDeleteCancel={onDeleteCancel}
        />
      ))}
    </div>
  );
}