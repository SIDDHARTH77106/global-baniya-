import { WalletCards } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function WholesalerPayoutsPage() {
  return (
    <DashboardLayout
      title="Wholesaler Payouts and Earnings"
      subtitle="Monitor bulk settlement cycles, wholesale earnings, payout status, and ledger adjustments."
      breadcrumbs={[{ label: 'Wholesaler', href: '/wholesaler/dashboard' }, { label: 'Payouts' }]}
    >
      <DashboardShell
        icon={WalletCards}
        title="Wholesaler Payouts"
        description="This route is ready for wholesale payment ledger rows, settlement filters, downloadable statements, and reconciliation actions."
      />
    </DashboardLayout>
  );
}
