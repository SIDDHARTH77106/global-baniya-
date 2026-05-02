import { BarChart3, PackageOpen, Tags, UsersRound } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminOverviewPage() {
  return (
    <DashboardLayout
      title="Admin Overview"
      subtitle="Platform-wide command center for inventory, categories, users, and operational settings."
      breadcrumbs={[{ label: 'Admin Overview' }]}
    >
      <DashboardShell
        icon={BarChart3}
        title="Global Baniya Admin Overview"
        description="A consolidated stats surface for marketplace health, inventory readiness, vendor activity, and platform risk."
        eyebrow="Admin"
      >
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Inventory Control', value: 'Live', icon: PackageOpen },
            { label: 'Category Systems', value: 'Ready', icon: Tags },
            { label: 'Vendor Users', value: 'Managed', icon: UsersRound },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="mb-4 h-6 w-6 text-emerald-700" />
                <p className="text-sm font-black text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{item.value}</p>
              </div>
            );
          })}
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
