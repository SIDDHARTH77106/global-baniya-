import { AlertTriangle, Bike, IndianRupee, PackageCheck, ShoppingBag } from 'lucide-react';
import { getLowStockAlerts } from '@/app/actions/inventory.actions';
import BarcodeScanBox from '@/components/dashboard/BarcodeScanBox';
import DropshipButton from '@/components/dashboard/DropshipButton';
import LowStockRestockList from '@/components/dashboard/LowStockRestockList';
import RecentActivity from '@/components/dashboard/RecentActivity';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default async function RetailerDashboard() {
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
      title="Retailer Fulfillment Dashboard"
      subtitle="A fast operational view for orders, delivery readiness, and critical inventory gaps."
      breadcrumbs={[
        { label: 'Retailer', href: '/retailer/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-500">
                Live
              </span>
            </div>
            <p className="text-sm font-black text-slate-500">Today&apos;s Orders</p>
            <p className="mt-1 text-3xl font-black text-slate-950">0</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">Order model is not present in the current Prisma schema.</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <IndianRupee className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-slate-500">Revenue</p>
            <p className="mt-1 text-3xl font-black text-slate-950">INR 0</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">Revenue will activate when orders are added.</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <Bike className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-slate-500">Active Deliveries</p>
            <p className="mt-1 text-3xl font-black text-slate-950">0</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">Delivery data requires an order fulfillment table.</p>
          </div>
        </section>

        <BarcodeScanBox />

        <section id="low-stock" className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-amber-100 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
                <h2 className="text-lg font-black text-amber-950">Critical Low Stock Alerts</h2>
              </div>
              <p className="mt-1 text-sm font-semibold text-amber-800">
                ProductVariant rows below 10 units, fetched directly from Prisma.
              </p>
            </div>
            <span className="w-fit rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-black text-amber-700">
              {lowStockItems.length} variants
            </span>
          </div>

          <LowStockRestockList items={alertItems} />
        </section>

        <section className="overflow-hidden rounded-lg border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 bg-red-50 px-5 py-4">
            <h2 className="text-lg font-black text-red-950">Smart Alerts: Reorder Points</h2>
            <p className="mt-1 text-sm font-semibold text-red-700">Items with qty below 10 enter the critical zone. Out-of-stock items can be dropshipped.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {alertItems.slice(0, 5).map((item) => (
              <div key={item.variant_id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-slate-950">{item.product_name}</p>
                  <p className="text-xs font-bold text-slate-500">{item.product_code} / {item.size_name} / qty {item.qty_in_stock}</p>
                </div>
                {item.qty_in_stock === 0 ? (
                  <DropshipButton productName={item.product_name} />
                ) : (
                  <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                    Reorder now
                  </span>
                )}
              </div>
            ))}
            {alertItems.length === 0 && <div className="p-6 text-center text-sm font-bold text-slate-500">No critical alerts right now.</div>}
          </div>
        </section>

        <RecentActivity />

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-emerald-700" />
                <h2 className="text-lg font-black text-slate-950">Recent Orders Needing Fulfillment</h2>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                This table is ready for live order rows once an Order model is added to Prisma.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Order</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Customer</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Status</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-8 text-center text-sm font-bold text-slate-500" colSpan={4}>
                    No order table exists in the current database schema, so no mock fulfillment rows are shown.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
