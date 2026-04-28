'use client';

import { usePOS } from './usePOS';
import { RoleLoadingState, OwnerBanner } from '@/app/components/pos/POSAtoms';
import ProductGrid  from '@/app/components/pos/POSProductGrid';
import CartPanel    from '@/app/components/pos/CartPanel';
import SuccessModal from '@/app/components/pos/SuccessModal';

export default function POSPage() {
  const pos = usePOS();

  if (pos.roleLoading) return <RoleLoadingState />;

  return (
    <div className="flex h-full bg-zinc-950 text-white overflow-hidden">
      {pos.isOwner && <OwnerBanner />}

      {/* Mobile cart drawer */}
      {pos.showCart && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-zinc-900"
          style={{ top: pos.isOwner ? '37px' : 0 }}
        >
          <CartPanel {...cartPanelProps(pos)} onClose={() => pos.setShowCart(false)} />
        </div>
      )}

      <div className="flex flex-1 h-full w-full" style={{ paddingTop: pos.isOwner ? '37px' : 0 }}>
        {/* Left: product catalog */}
        <ProductGrid
          products={pos.filteredProducts}
          warehouses={pos.warehouses}
          cart={pos.cart}
          loading={pos.loading}
          search={pos.search}
          selectedWarehouse={pos.selectedWarehouse}
          readOnly={pos.readOnly}
          totalQty={pos.totalQty}
          subtotal={pos.subtotal}
          onSearchChange={pos.setSearch}
          onWarehouseChange={pos.setSelectedWarehouse}
          onAddToCart={pos.addToCart}
          onRefresh={pos.loadProducts}
          onOpenCart={() => pos.setShowCart(true)}
        />

        {/* Right: cart (desktop always visible) */}
        <div className="hidden md:flex md:w-80 xl:w-96 flex-col">
          <CartPanel {...cartPanelProps(pos)} onClose={() => {}} />
        </div>
      </div>

      {pos.successData && (
        <SuccessModal data={pos.successData} onDismiss={pos.dismissSuccess} />
      )}
    </div>
  );
}

// ─── Helper: extract CartPanel props from the hook return ─────────────────────
function cartPanelProps(pos: ReturnType<typeof usePOS>) {
  return {
    cart:              pos.cart,
    totalQty:          pos.totalQty,
    subtotal:          pos.subtotal,
    readOnly:          pos.readOnly,
    paymentMethod:     pos.paymentMethod,
    cashInput:         pos.cashInput,
    cashNum:           pos.cashNum,
    change:            pos.change,
    canPay:            pos.canPay,
    processing:        pos.processing,
    onClearCart:       pos.clearCart,
    onRemoveItem:      pos.removeItem,
    onQtyChange:       pos.updateQty,
    onMethodChange:    pos.setPaymentMethod,
    onCashInputChange: pos.setCashInput,
    onCheckout:        pos.handleCheckout,
  };
}