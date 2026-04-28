'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchWarehouses, submitCheckout } from './services';
import type { Product, CartItem, SuccessData } from './types';

export function usePOS() {
  // ─── Role ─────────────────────────────────────────────────────────────────
  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') ?? '');
    setRoleLoading(false);
  }, []);

  const isOwner  = role === 'Owner';
  const readOnly = isOwner;

  // ─── Data ─────────────────────────────────────────────────────────────────
  const [products, setProducts]                   = useState<Product[]>([]);
  const [warehouses, setWarehouses]               = useState<{ id: number; name: string }[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(0);
  const [loading, setLoading]                     = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setProducts(await fetchProducts());
    setLoading(false);
  }, []);

  const loadWarehouses = useCallback(async () => {
    setWarehouses(await fetchWarehouses());
  }, []);

  useEffect(() => {
    if (role === 'Kasir' || role === 'Owner') {
      loadWarehouses();
      loadProducts();
    }
  }, [role, loadProducts, loadWarehouses]);

  // ─── Search / filter ──────────────────────────────────────────────────────
  const [search, setSearch] = useState('');

  const filteredProducts = products
    .filter(p => selectedWarehouse === 0 || p.id_warehouse === selectedWarehouse)
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
    );

  // ─── Cart ─────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    if (readOnly || product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    if (readOnly) return;
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: Math.max(1, Math.min(i.qty + delta, i.stock)) } : i)
        .filter(i => i.qty > 0),
    );
  };

  const removeItem = (id: number) => {
    if (!readOnly) setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    if (!readOnly) setCart([]);
  };

  // ─── Computed ─────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.price_sell * i.qty, 0);
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  // ─── Payment ──────────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashInput, setCashInput]         = useState('');

  const cashNum = parseFloat(cashInput.replace(/\D/g, '')) || 0;
  const change  = paymentMethod === 'cash' ? cashNum - subtotal : 0;
  const canPay  = !readOnly && cart.length > 0 && (paymentMethod !== 'cash' || cashNum >= subtotal);

  // ─── Checkout ─────────────────────────────────────────────────────────────
  const [processing, setProcessing]   = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const handleCheckout = async () => {
    if (!canPay) return;
    setProcessing(true);
    try {
      const invoice = await submitCheckout(cart, subtotal, paymentMethod, selectedWarehouse);

      // Optimistic local stock update — no refetch needed
      setProducts(prev => prev.map(p => {
        const item = cart.find(i => i.id === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
      }));

      setSuccessData({ invoice, total: subtotal, method: paymentMethod, change });
      clearCart();
      setCashInput('');
      setShowCart(false);
    } catch (e: any) {
      alert('Checkout gagal: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const dismissSuccess = () => setSuccessData(null);

  // ─── Mobile cart drawer ───────────────────────────────────────────────────
  const [showCart, setShowCart] = useState(false);

  return {
    // role
    role, roleLoading, isOwner, readOnly,
    // data
    products, warehouses, selectedWarehouse, setSelectedWarehouse, loading,
    // search
    search, setSearch, filteredProducts,
    // cart
    cart, totalQty, subtotal, addToCart, updateQty, removeItem, clearCart,
    // payment
    paymentMethod, setPaymentMethod, cashInput, setCashInput,
    cashNum, change, canPay,
    // checkout
    processing, handleCheckout, successData, dismissSuccess,
    // ui
    showCart, setShowCart, loadProducts,
  };
}