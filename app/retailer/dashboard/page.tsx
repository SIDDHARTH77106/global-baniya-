import Link from 'next/link';
import { AlertCircle, ArrowRight, IndianRupee, Package, ShoppingCart, Store } from 'lucide-react';
import VendorSidebar from '@/components/layout/VendorSidebar';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getRetailerDashboardData() {
  const lowStockItems = await prisma.productVariant.findMany({
    where: {
      qty_in_stock: {
        gt: 0,
        lte: 10,
      },
    },
    take: 8,
    orderBy: { qty_in_stock: 'asc' },
    include: {
      sizeOption: true,
      productItem: {
        include: {
          color: true,
          product: {
            include: {
              brand: true,
            },
          },
        },
      },
    },
  });

  const outOfStockCount = await prisma.productVariant.count({
    where: { qty_in_stock: 0 },
  });

  return {
    dailyActiveOrders: 0,
    revenueToday: 0,
    lowStockItems,
    outOfStockCount,
  };
}

export default async function RetailerDashboard() {
  const dashboard = await getRetailerDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <VendorSidebar />

      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-black text-gray-950">
              <Store className="h-8 w-8 text-emerald-600" />
              Retailer Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Live inventory alerts are synced from ProductVariant.qty_in_stock.
            </p>
          </div>

          <Link
            href="/admin/inventory"
            className="flex w-fit items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <Package className="h-5 w-5" />
            Update Stock
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">Daily Active Orders</p>
            <h2 className="mt-1 text-3xl font-black text-gray-950">{dashboard.dailyActiveOrders}</h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <IndianRupee className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">Revenue Today</p>
            <h2 className="mt-1 text-3xl font-black text-gray-950">INR {dashboard.revenueToday}</h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">Stock Alerts</p>
            <h2 className="mt-1 text-3xl font-black text-gray-950">
              {dashboard.lowStockItems.length + dashboard.outOfStockCount}
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h2 className="text-lg font-black text-gray-950">Low Stock Alerts</h2>
              <p className="text-sm font-medium text-gray-500">Restock anything at or below 10 units.</p>
            </div>
            <Link href="/admin/inventory" className="flex items-center gap-1 text-sm font-bold text-emerald-700">
              Inventory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">Product</th>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">product_code</th>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">color</th>
                  <th className="p-4 text-xs font-black uppercase text-gray-500">qty_in_stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.lowStockItems.map((item) => (
                  <tr key={item.variant_id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold text-gray-950">{item.productItem.product.product_name}</p>
                      <p className="text-xs font-semibold text-gray-500">
                        {item.productItem.product.brand?.brand_name ?? 'No brand'}
                      </p>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-gray-700">
                      {item.productItem.product_code}
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-700">
                      {item.productItem.color?.color_name ?? 'Default'} / {item.sizeOption.size_name}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-black uppercase text-yellow-700">
                        {item.qty_in_stock} left
                      </span>
                    </td>
                  </tr>
                ))}

                {dashboard.lowStockItems.length === 0 && (
                  <tr>
                    <td className="p-8 text-center text-sm font-bold text-gray-500" colSpan={4}>
                      No low-stock ProductVariant rows right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
