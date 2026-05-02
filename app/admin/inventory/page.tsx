import { revalidatePath } from 'next/cache';
import { AlertCircle, PackageOpen, Save } from 'lucide-react';
import VendorSidebar from '@/components/layout/VendorSidebar';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return 0;
}

async function updateInventory(formData: FormData) {
  'use server';

  const variantId = String(formData.get('variantId') || '');
  const qtyInStock = Number(formData.get('qty_in_stock'));

  if (!variantId || !Number.isInteger(qtyInStock) || qtyInStock < 0) {
    throw new Error('qty_in_stock must be a non-negative whole number.');
  }

  await prisma.productVariant.update({
    where: { variant_id: variantId },
    data: { qty_in_stock: qtyInStock },
  });

  revalidatePath('/admin/inventory');
}

async function getInventory() {
  return prisma.productVariant.findMany({
    orderBy: [{ qty_in_stock: 'asc' }, { variant_id: 'asc' }],
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

export default async function InventoryDashboard() {
  const inventory = await getInventory();
  const totalUnits = inventory.reduce((sum, item) => sum + item.qty_in_stock, 0);
  const lowStockCount = inventory.filter((item) => item.qty_in_stock > 0 && item.qty_in_stock <= 10).length;
  const outOfStockCount = inventory.filter((item) => item.qty_in_stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <VendorSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-black text-gray-950">
                <PackageOpen className="h-8 w-8 text-emerald-600" />
                Master Inventory Control
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Stock is tracked strictly at ProductVariant.qty_in_stock.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                <p className="text-lg font-black text-gray-950">{totalUnits}</p>
                <p className="text-[10px] font-bold uppercase text-gray-400">Units</p>
              </div>
              <div className="rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3">
                <p className="text-lg font-black text-yellow-700">{lowStockCount}</p>
                <p className="text-[10px] font-bold uppercase text-yellow-700">Low</p>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-lg font-black text-red-700">{outOfStockCount}</p>
                <p className="text-[10px] font-bold uppercase text-red-700">Out</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-black uppercase text-gray-500">Product</th>
                    <th className="p-4 text-xs font-black uppercase text-gray-500">ProductItem</th>
                    <th className="p-4 text-xs font-black uppercase text-gray-500">Color</th>
                    <th className="p-4 text-xs font-black uppercase text-gray-500">Size</th>
                    <th className="p-4 text-xs font-black uppercase text-gray-500">Price</th>
                    <th className="p-4 text-xs font-black uppercase text-gray-500">qty_in_stock</th>
                    <th className="p-4 text-right text-xs font-black uppercase text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((variant) => {
                    const item = variant.productItem;
                    const product = item.product;
                    const originalPrice = toNumber(item.original_price);
                    const salePrice = item.sale_price ? toNumber(item.sale_price) : originalPrice;

                    return (
                      <tr key={variant.variant_id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-bold text-gray-950">{product.product_name}</p>
                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            {product.brand?.brand_name ?? 'No brand'} / {product.productType.type_name}
                          </p>
                        </td>
                        <td className="p-4 font-mono text-xs font-bold text-gray-700">
                          {item.product_code}
                        </td>
                        <td className="p-4 text-sm font-bold text-gray-700">
                          {item.color?.color_name ?? 'Default'}
                        </td>
                        <td className="p-4 text-sm font-bold text-gray-700">{variant.sizeOption.size_name}</td>
                        <td className="p-4">
                          <p className="text-sm font-black text-gray-950">INR {salePrice}</p>
                          {originalPrice > salePrice && (
                            <p className="text-xs font-semibold text-gray-400 line-through">INR {originalPrice}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <form id={`inventory-${variant.variant_id}`} action={updateInventory} className="flex flex-col gap-2">
                            <input type="hidden" name="variantId" value={variant.variant_id} />
                            <input
                              type="number"
                              min={0}
                              name="qty_in_stock"
                              defaultValue={variant.qty_in_stock}
                              className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-black text-gray-950 outline-none focus:border-emerald-500"
                            />
                            {variant.qty_in_stock > 10 ? (
                              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase text-green-700">
                                {variant.qty_in_stock} in stock
                              </span>
                            ) : variant.qty_in_stock > 0 ? (
                              <span className="flex w-fit items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-black uppercase text-yellow-700">
                                <AlertCircle className="h-3 w-3" /> Low stock
                              </span>
                            ) : (
                              <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-[10px] font-black uppercase text-red-700">
                                Out of stock
                              </span>
                            )}
                          </form>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="submit"
                            form={`inventory-${variant.variant_id}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {inventory.length === 0 && (
                    <tr>
                      <td className="p-8 text-center text-sm font-bold text-gray-500" colSpan={7}>
                        No ProductVariant rows exist yet. Add product items and size variants to track stock.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
