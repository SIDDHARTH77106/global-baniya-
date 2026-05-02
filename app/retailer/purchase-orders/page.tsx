import { ClipboardList } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function RetailerPurchaseOrdersPage() {
  return (
    <DashboardLayout title="Purchase Orders" subtitle="Raise replenishment POs to admin or wholesalers." breadcrumbs={[{ label: 'Retailer', href: '/retailer/dashboard' }, { label: 'Purchase Orders' }]}>
      <DashboardShell icon={ClipboardList} title="Purchase Orders" description="PO creation, approval, receiving, and variance tracking will live here." eyebrow="Procurement" badge="PO model pending">
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
          No purchase orders yet. Use Smart Alerts to identify replenishment candidates.
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
