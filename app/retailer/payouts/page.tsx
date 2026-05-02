import { WalletCards } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function RetailerPayoutsPage() {
  return (
    <DashboardLayout
      title="Retailer Payouts and Earnings"
      subtitle="Monitor settlement cycles, earnings summaries, payout status, and adjustments."
      breadcrumbs={[{ label: 'Retailer', href: '/retailer/dashboard' }, { label: 'Payouts' }]}
    >
      <DashboardShell
        icon={WalletCards}
        title="Retailer Payouts"
        description="This route is ready for payment ledger rows, settlement filters, downloadable statements, and reconciliation actions."
      />
    </DashboardLayout>
  );
}
