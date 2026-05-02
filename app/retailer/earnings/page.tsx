import { WalletCards } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function RetailerEarningsPage() {
  return (
    <DashboardLayout title="My Earnings" subtitle="Retailer earnings, commissions, payouts, and settlement status." breadcrumbs={[{ label: 'Retailer', href: '/retailer/dashboard' }, { label: 'My Earnings' }]}>
      <DashboardShell icon={WalletCards} title="Retailer Earnings" description="A clean finance surface for payouts and adjustments once sales orders are connected." eyebrow="Finance" badge="Settlement pending" />
    </DashboardLayout>
  );
}
