import { Banknote, Smartphone, CreditCard } from 'lucide-react';

export const PAYMENT_METHODS = [
  { id: 'cash',     label: 'Tunai',    icon: Banknote },
  { id: 'transfer', label: 'Transfer', icon: Smartphone },
  { id: 'card',     label: 'Kartu',    icon: CreditCard },
] as const;

export type PaymentMethodId = typeof PAYMENT_METHODS[number]['id'];

export const CASH_QUICK_AMOUNTS = [20_000, 50_000, 100_000] as const;