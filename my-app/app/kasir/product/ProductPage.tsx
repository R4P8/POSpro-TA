'use client';

import { useProduct } from './useProduct';
import { RoleLoadingState, LoadingState, ErrorState, EmptyState } from '@/app/components/product/ProductAtoms';
import ProductHeader from '@/app/components/product/ProductHeader';
import ProductGrid   from '@/app/components/product/ProductGrid';

export default function ProductPage() {
  const p = useProduct();

  if (p.roleLoading) return <RoleLoadingState />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 overflow-auto">
        <ProductHeader
          canEdit={false}
          mobileMenuOpen={false}
          onToggleMobileMenu={() => {}}
          onAdd={() => {}}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {p.loading && <LoadingState />}

          {!p.loading && p.error && (
            <ErrorState message={p.error} onRetry={p.loadProducts} />
          )}

          {!p.loading && !p.error && p.products.length === 0 && (
            <EmptyState canEdit={false} onAdd={() => {}} />
          )}

          {!p.loading && !p.error && p.products.length > 0 && (
            <ProductGrid
              products={p.products}
              canEdit={false}
              deleteId={null}
              getWarehouseName={p.getWarehouseName}
              onEdit={() => {}}
              onDeleteRequest={() => {}}
              onDeleteConfirm={() => {}}
              onDeleteCancel={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  );
}