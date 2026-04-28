'use client';

import { useProduct } from './useProduct';
import ProductHeader from '@/app/components/product/ProductHeader';
import ProductGrid from '@/app/components/product/ProductGrid';
import ProductModal from '@/app/components/product/ProductModal';
import { LoadingState, ErrorState, EmptyState, RoleLoadingState } from '@/app/components/product/ProductAtoms';

export default function ProductPage() {
  const {
    products, warehouses, loading, error, roleLoading, canEdit,
    showModal, editTarget, form, setForm, saving,
    deleteId, setDeleteId, mobileMenuOpen, setMobileMenuOpen,
    openCreate, openEdit, closeModal, handleSave, handleDelete,
    loadProducts, getWarehouseName,
  } = useProduct();

  if (roleLoading) return <RoleLoadingState />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 overflow-auto">
        <ProductHeader
          canEdit={canEdit}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
          onAdd={openCreate}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {loading && <LoadingState />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadProducts} />
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyState canEdit={canEdit} onAdd={openCreate} />
          )}

          {!loading && !error && products.length > 0 && (
            <ProductGrid
              products={products}
              canEdit={canEdit}
              deleteId={deleteId}
              getWarehouseName={getWarehouseName}
              onEdit={openEdit}
              onDeleteRequest={(id) => setDeleteId(id)}
              onDeleteConfirm={handleDelete}
              onDeleteCancel={() => setDeleteId(null)}
            />
          )}
        </div>
      </main>

      {showModal && canEdit && (
        <ProductModal
          isEdit={!!editTarget}
          form={form}
          warehouses={warehouses}
          saving={saving}
          onClose={closeModal}
          onSave={handleSave}
          onChange={setForm}
        />
      )}
    </div>
  );
}