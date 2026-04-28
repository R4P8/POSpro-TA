import type { SalesPerDay, AggregatedDay } from './types';
import { formatDateLabel } from './utils';

export function aggregateByDay(rows: SalesPerDay[]): AggregatedDay[] {
  const map: Record<string, { revenue: number; items: number; transaksi: number }> = {};

  rows.forEach((d) => {
    const key = d.created_at.slice(0, 10);
    if (!map[key]) map[key] = { revenue: 0, items: 0, transaksi: 0 };
    map[key].revenue   += d.total;
    map[key].items     += d.quantity;
    map[key].transaksi += 1;
  });

  const sorted = Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));

  return sorted.map(([date, v], i, arr) => {
    const prev   = arr[i + 1]?.[1]?.revenue ?? 0;
    const growth = prev > 0 ? ((v.revenue - prev) / prev) * 100 : 0;
    return {
      date,
      label: formatDateLabel(date),
      transaksi: v.transaksi,
      revenue: v.revenue,
      items: v.items,
      growth,
    };
  });
}