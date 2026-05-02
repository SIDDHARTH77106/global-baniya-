import { PackagePlus } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function NewAdminProductPage() {
  return (
    <DashboardLayout
      title="Add New Product"
      subtitle="Create a Product, ProductItem, and ProductVariant through a guided admin workflow."
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Master Inventory', href: '/admin/inventory' },
        { label: 'Add New Product' },
      ]}
    >
      <DashboardShell
        icon={PackagePlus}
        title="Add New Product Form"
        description="The master inventory table already supports product bundle creation. This dedicated route is scaffolded for a fuller enterprise product creation flow."
      >
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {['Product details', 'Item pricing', 'Variant stock'].map((step, index) => (
              <div key={step} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Step {index + 1}</p>
                <p className="mt-2 text-lg font-black text-slate-950">{step}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">Form controls will be connected here.</p>
              </div>
            ))}
          </div>
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
