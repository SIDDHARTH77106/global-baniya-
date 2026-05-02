import { ClipboardList } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function RetailerOrdersPage() {
  return (
    <DashboardLayout
      title="Retailer Order Management"
      subtitle="Track incoming customer orders, packing status, delivery handoff, and fulfillment exceptions."
      breadcrumbs={[{ label: 'Retailer', href: '/retailer/dashboard' }, { label: 'Orders' }]}
    >
      <DashboardShell
        icon={ClipboardList}
        title="Retailer Orders"
        description="This page is ready for order queues, fulfillment filters, delivery status changes, and exception handling once the Order model is added."
        eyebrow="Operations"
        badge="Order model pending"
      >
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-black text-slate-950">Order Queue</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">No order table exists in the current Prisma schema.</p>
          </div>
          <div className="p-8 text-center text-sm font-bold text-slate-500">No retailer orders to display yet.</div>
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
