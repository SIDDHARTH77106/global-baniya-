import { ReceiptText } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function WholesalerInvoicesPage() {
  return (
    <DashboardLayout title="Wholesale Invoices" subtitle="Bulk invoice generation, payment status, and statement download surface." breadcrumbs={[{ label: 'Wholesaler', href: '/wholesaler/dashboard' }, { label: 'Invoices' }]}>
      <DashboardShell icon={ReceiptText} title="Invoices" description="Invoice rows will appear here once bulk order billing is connected." eyebrow="Billing" badge="Invoice model pending" />
    </DashboardLayout>
  );
}
