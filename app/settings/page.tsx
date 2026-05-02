import { UserRound } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AccountSettingsPage() {
  return (
    <DashboardLayout
      title="Account Settings"
      subtitle="Manage profile details, security preferences, and dashboard account defaults."
      breadcrumbs={[{ label: 'Account Settings' }]}
    >
      <DashboardShell
        icon={UserRound}
        title="Account Settings"
        description="This route backs the dashboard account menu and is ready for profile, password, and notification preference forms."
        eyebrow="Profile"
        badge="Forms pending"
      />
    </DashboardLayout>
  );
}
