import { Tags } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminCategoriesPage() {
  return (
    <DashboardLayout
      title="Category Management"
      subtitle="Build and govern product types, categories, hierarchy, and size category mapping."
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Category Management' }]}
    >
      <DashboardShell
        icon={Tags}
        title="Category Management"
        description="This workspace will manage ProductType and ProductCategory records, parent categories, category imagery, and size category relationships."
      />
    </DashboardLayout>
  );
}
