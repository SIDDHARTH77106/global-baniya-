import { UsersRound } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminUsersPage() {
  return (
    <DashboardLayout
      title="User and Vendor Management"
      subtitle="Review customers, retailers, wholesalers, and admin accounts from one secure surface."
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
    >
      <DashboardShell
        icon={UsersRound}
        title="User and Vendor Management"
        description="This page is ready for role filters, account verification, vendor approvals, and operational account controls."
      />
    </DashboardLayout>
  );
}
