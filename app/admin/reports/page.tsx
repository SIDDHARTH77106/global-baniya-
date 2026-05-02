import { BarChart3 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminReportsPage() {
  return (
    <DashboardLayout title="Reports" subtitle="Executive reporting for stock health, sales velocity, vendor performance, and margin." breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Reports' }]}>
      <DashboardShell icon={BarChart3} title="Business Reports" description="Report cards and exports will connect here after order and payout facts are stored." eyebrow="Analytics" badge="BI pending">
        <section className="grid gap-4 md:grid-cols-3">
          {['Inventory Health', 'Sales Velocity', 'Vendor SLA'].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-slate-500">{item}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">--</p>
            </div>
          ))}
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
