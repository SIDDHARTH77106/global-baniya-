import { AlertTriangle } from 'lucide-react';
import { getLowStockAlerts } from '@/app/actions/inventory.actions';
import DashboardShell from '@/components/dashboard/DashboardShell';
import LowStockRestockList from '@/components/dashboard/LowStockRestockList';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default async function WholesalerAlertsPage() {
  const lowStockItems = await getLowStockAlerts();
  const alertItems = lowStockItems.map((variant) => ({
    variant_id: variant.variant_id,
    qty_in_stock: variant.qty_in_stock,
    size_name: variant.sizeOption.size_name,
    product_name: variant.productItem.product.product_name,
    product_code: variant.productItem.product_code,
    brand_name: variant.productItem.product.brand?.brand_name ?? null,
    type_name: variant.productItem.product.productType.type_name,
    color_name: variant.productItem.color?.color_name ?? null,
  }));

  return (
    <DashboardLayout
      title="Wholesaler Low Stock Alerts"
      subtitle="Dedicated restocking queue for wholesale-ready ProductVariant inventory gaps."
      breadcrumbs={[{ label: 'Wholesaler', href: '/wholesaler/dashboard' }, { label: 'Low Stock Alerts' }]}
    >
      <DashboardShell
        icon={AlertTriangle}
        title="Wholesale Low Stock Alerts"
        description="Restock low-stock variants directly from this page. Successful updates instantly remove items from the alert queue."
        eyebrow={`${lowStockItems.length} variants`}
      >
        <section className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
          <LowStockRestockList items={alertItems} />
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
