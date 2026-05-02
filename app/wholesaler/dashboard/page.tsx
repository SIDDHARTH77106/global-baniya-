import Link from 'next/link';
import { AlertTriangle, Boxes, ClipboardList, PackageOpen, Truck } from 'lucide-react';
import { getLowStockAlerts } from '@/app/actions/inventory.actions';
import LowStockRestockList from '@/components/dashboard/LowStockRestockList';
import RecentActivity from '@/components/dashboard/RecentActivity';
import VendorSidebar from '@/components/layout/VendorSidebar';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return 0;
}

async function getBulkInventory() {
  return prisma.productVariant.findMany({
    where: { qty_in_stock: { gt: 0 } },
    take: 12,
    orderBy: [{ qty_in_stock: 'desc' }, { variant_id: 'asc' }],
    include: {
      sizeOption: true,
      productItem: {
        include: {
          color: true,
          product: {
            include: {
              brand: true,
              productType: true,
            },
          },
        },
      },
    },
  });
}

export default async function WholesalerDashboard() {
  const [bulkInventory, lowStockItems] = await Promise.all([getBulkInventory(), getLowStockAlerts()]);
  const totalBulkUnits = bulkInventory.reduce((sum, item) => sum + item.qty_in_stock, 0);
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
    <div className="min-h-screen bg-gray-50 lg:flex">
      <VendorSidebar />

      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-black text-gray-950">
              <Truck className="h-8 w-8 text-emerald-600" />
              Wholesaler Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Bulk supply view backed by available ProductVariant inventory.
            </p>
          </div>

          <Link
            href="/wholesaler/orders"
            className="flex w-fit items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <ClipboardList className="h-5 w-5" />
            Bulk Orders
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Boxes className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">Available Bulk Units</p>
            <h2 className="mt-1 text-3xl font-black text-gray-950">{totalBulkUnits}</h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <PackageOpen className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">Active SKUs</p>
            <h2 className="mt-1 text-3xl font-black text-gray-950">{bulkInventory.length}</h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <ClipboardList className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">Bulk Orders Pending</p>
            <h2 className="mt-1 text-3xl font-black text-gray-950">0</h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-950">Bulk-Ready Inventory</h2>
            <p className="text-sm font-medium text-gray-500">
              Only ProductVariant rows with qty_in_stock above zero are shown.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">Product</th>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">product_code</th>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">Wholesale Stock</th>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">Sale Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bulkInventory.map((item) => (
                  <tr key={item.variant_id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold text-gray-950">{item.productItem.product.product_name}</p>
                      <p className="text-xs font-semibold text-gray-500">
                        {item.productItem.product.brand?.brand_name ?? 'No brand'} / {item.productItem.product.productType.type_name}
                      </p>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-gray-700">
                      {item.productItem.product_code} / {item.sizeOption.size_name}
                    </td>
                    <td className="p-4 text-sm font-black text-gray-950">{item.qty_in_stock}</td>
                    <td className="p-4 text-sm font-black text-gray-950">
                      INR {item.productItem.sale_price ? toNumber(item.productItem.sale_price) : toNumber(item.productItem.original_price)}
                    </td>
                  </tr>
                ))}

                {bulkInventory.length === 0 && (
                  <tr>
                    <td className="p-8 text-center text-sm font-bold text-gray-500" colSpan={4}>
                      No available ProductVariant inventory for bulk ordering yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <section id="low-stock" className="mt-8 overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-amber-100 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
                <h2 className="text-lg font-black text-amber-950">Wholesale Low Stock Alerts</h2>
              </div>
              <p className="mt-1 text-sm font-semibold text-amber-800">
                Restock ProductVariant rows below 10 units without leaving the dashboard.
              </p>
            </div>
            <span className="w-fit rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-black text-amber-700">
              {lowStockItems.length} variants
            </span>
          </div>

          <LowStockRestockList items={alertItems} />
        </section>

        <div className="mt-8">
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
