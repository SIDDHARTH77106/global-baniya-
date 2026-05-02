import { Settings } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout
      title="Platform Settings"
      subtitle="Configure marketplace policies, inventory thresholds, payment settings, and operational defaults."
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}
    >
      <DashboardShell
        icon={Settings}
        title="Platform Settings"
        description="This shell is reserved for global quick-commerce configuration, notification rules, vendor policies, and service-level controls."
      />
    </DashboardLayout>
  );
}
