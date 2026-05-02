import { WalletCards } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminPayoutsPage() {
  return (
    <DashboardLayout title="Platform Payouts" subtitle="Settlement command center for retailers, wholesalers, commissions, and adjustments." breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payouts' }]}>
      <DashboardShell icon={WalletCards} title="Payout Ledger" description="Prepared for vendor settlements, payout holds, reconciliation, and downloadable statements." eyebrow="Finance" badge="Ledger pending" />
    </DashboardLayout>
  );
}
