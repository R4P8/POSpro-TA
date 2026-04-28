'use client';

import ProductCard from './ProductCard';
import type { Product } from '@/app/admin/product/types';

interface ProductGridProps {
  products: Product[];
  canEdit: boolean;
  deleteId: number | null;
  getWarehouseName: (id: number) => string;
  onEdit: (p: Product) => void;
  onDeleteRequest: (id: number) => void;
  onDeleteConfirm: (id: number) => void;
  onDeleteCancel: () => void;
}

export default function ProductGrid({
  products,
  canEdit,
  deleteId,
  getWarehouseName,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          warehouseName={getWarehouseName(p.id_warehouse)}
          canEdit={canEdit}
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