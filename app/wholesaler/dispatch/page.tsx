import { Truck } from 'lucide-react';
import ChallanAction from '@/components/dashboard/ChallanAction';
import FulfillmentPipeline from '@/components/dashboard/FulfillmentPipeline';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function WholesalerDispatchPage() {
  return (
    <DashboardLayout title="Dispatch and Shipping" subtitle="Bulk order pick, pack, dispatch, and shipping document workspace." breadcrumbs={[{ label: 'Wholesaler', href: '/wholesaler/dashboard' }, { label: 'Dispatch/Shipping' }]}>
      <DashboardShell icon={Truck} title="Dispatch Queue" description="Coordinate outbound wholesale orders with shipment-ready operational stages." eyebrow="Fulfillment">
        <div className="space-y-6">
          <FulfillmentPipeline />
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Shipping Documents</h2>
                <p className="text-sm font-semibold text-slate-500">Generate compliance documents when dispatch models are connected.</p>
              </div>
              <ChallanAction />
            </div>
          </section>
        </div>
      </DashboardShell>
    </DashboardLayout>
  );
}
