import { ClipboardList } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function WholesalerOrdersPage() {
  return (
    <DashboardLayout
      title="Wholesaler Order Management"
      subtitle="Manage bulk order intake, allocation, dispatch status, and fulfillment exceptions."
      breadcrumbs={[{ label: 'Wholesaler', href: '/wholesaler/dashboard' }, { label: 'Orders' }]}
    >
      <DashboardShell
        icon={ClipboardList}
        title="Wholesale Orders"
        description="This page is ready for bulk order queues, allocation controls, invoice status, and dispatch workflows once order models are added."
        eyebrow="Operations"
        badge="Order model pending"
      >
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-black text-slate-950">Bulk Order Queue</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">No order table exists in the current Prisma schema.</p>
          </div>
          <div className="p-8 text-center text-sm font-bold text-slate-500">No wholesaler orders to display yet.</div>
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
