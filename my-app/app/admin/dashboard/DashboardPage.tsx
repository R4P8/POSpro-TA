'use client';

import { useDashboard } from './useDashboard';
import { RoleLoadingState, ForbiddenPage } from '@/app/components/dashboard/DashboardAtoms';
import DashboardHeader   from '@/app/components/dashboard/DashboardHeader';
import StatsGrid         from '@/app/components/dashboard/StatsGrid';
import BestSellerPanel   from '@/app/components/dashboard/BestSellerPanel';
import CriticalStockPanel from '@/app/components/dashboard/CriticalStockPanel';
import TransactionTable  from '@/app/components/dashboard/TransactionTable';

export default function DashboardPage() {
  const { role, roleLoading, trx, best, critical, stats, isAnyLoading, fetchAll } = useDashboard();

  if (roleLoading)       return <RoleLoadingState />;
  if (role !== 'Owner')  return <ForbiddenPage role={role ?? 'unknown'} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <DashboardHeader isLoading={isAnyLoading} onRefresh={fetchAll} />

      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BestSellerPanel
            data={best.data}
            loading={best.loading}
            error={best.error}
            onRefresh={best.load}
          />
          <CriticalStockPanel
            data={critical.data}
            loading={critical.loading}
            error={critical.error}
            onRefresh={critical.load}
          />
        </div>

        <TransactionTable
          data={trx.data}
          loading={trx.loading}
          error={trx.error}
          onRefresh={trx.load}
        />
      </div>
    </div>
  );
}