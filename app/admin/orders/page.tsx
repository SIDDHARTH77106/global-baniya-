import { ClipboardList } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminOrdersPage() {
  return (
    <DashboardLayout title="All Orders" subtitle="Platform order supervision across customer, retailer, and wholesaler channels." breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'All Orders' }]}>
      <DashboardShell icon={ClipboardList} title="All Orders Control" description="Central order table placeholder ready for order, payment, delivery, and exception models." eyebrow="Admin" badge="Order model pending">
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
          No live orders yet. This page is scaffolded for marketplace-wide order governance.
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
