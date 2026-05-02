import { AlertTriangle, PackageOpen, ShieldCheck } from 'lucide-react';
import InventoryTable, { InventoryProduct } from '@/components/admin/InventoryTable';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return 0;
}

type InventoryFilters = {
  query: string;
  productTypeId: string;
  stockStatus: 'all' | 'low' | 'out';
};

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

async function getInventoryProducts(filters: InventoryFilters): Promise<InventoryProduct[]> {
  const search = filters.query.trim();
  const where = {
    AND: [
      search
        ? {
            OR: [
              { product_name: { contains: search } },
              {
                productItems: {
                  some: {
                    product_code: { contains: search },
                  },
                },
              },
            ],
          }
        : {},
      filters.productTypeId ? { product_type: filters.productTypeId } : {},
      filters.stockStatus === 'low'
        ? {
            productItems: {
              some: {
                productVariants: {
                  some: {
                    qty_in_stock: { gt: 0, lt: 10 },
                  },
                },
              },
            },
          }
        : {},
      filters.stockStatus === 'out'
        ? {
            productItems: {
              some: {
                productVariants: {
                  some: {
                    qty_in_stock: 0,
                  },
                },
              },
            },
          }
        : {},
    ],
  };

  const products = await prisma.product.findMany({
    where,
    orderBy: { product_name: 'asc' },
    include: {
      brand: true,
      productType: true,
      productItems: {
        orderBy: { product_code: 'asc' },
        include: {
          color: true,
          productVariants: {
            orderBy: [{ qty_in_stock: 'asc' }, { variant_id: 'asc' }],
            include: {
              sizeOption: true,
            },
          },
        },
      },
    },
  });

  return products.map((product) => ({
    product_id: product.product_id,
    product_name: product.product_name,
    product_desc: product.product_desc,
    original_price: toNumber(product.original_price),
    sale_price: product.sale_price === null ? null : toNumber(product.sale_price),
    brand: product.brand ? { brand_name: product.brand.brand_name } : null,
    productType: { type_name: product.productType.type_name },
    productItems: product.productItems.map((item) => ({
      product_item_id: item.product_item_id,
      product_code: item.product_code,
      original_price: toNumber(item.original_price),
      sale_price: item.sale_price === null ? null : toNumber(item.sale_price),
      color: item.color ? { color_name: item.color.color_name } : null,
      productVariants: item.productVariants.map((variant) => ({
        variant_id: variant.variant_id,
        qty_in_stock: variant.qty_in_stock,
        sizeOption: { size_name: variant.sizeOption.size_name },
      })),
    })),
  }));
}

async function getCreationOptions() {
  const [productTypes, brands, colors, sizes] = await Promise.all([
    prisma.productType.findMany({ orderBy: { type_name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { brand_name: 'asc' } }),
    prisma.color.findMany({ orderBy: { color_name: 'asc' } }),
    prisma.sizeOption.findMany({ orderBy: { size_name: 'asc' } }),
  ]);

  return {
    productTypes: productTypes.map((type) => ({ id: type.product_type_id, label: type.type_name })),
    brands: brands.map((brand) => ({ id: brand.brand_id, label: brand.brand_name })),
    colors: colors.map((color) => ({ id: color.color_id, label: color.color_name })),
    sizes: sizes.map((size) => ({ id: size.size_id, label: size.size_name })),
  };
}

export default async function InventoryDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const stockParam = readParam(params.stock);
  const filters: InventoryFilters = {
    query: readParam(params.q),
    productTypeId: readParam(params.type),
    stockStatus: stockParam === 'low' || stockParam === 'out' ? stockParam : 'all',
  };

  const [products, options] = await Promise.all([getInventoryProducts(filters), getCreationOptions()]);
  const totalVariants = products.reduce(
    (sum, product) => sum + product.productItems.reduce((itemSum, item) => itemSum + item.productVariants.length, 0),
    0
  );
  const lowStockVariants = products.reduce(
    (sum, product) =>
      sum +
      product.productItems.reduce(
        (itemSum, item) =>
          itemSum + item.productVariants.filter((variant) => variant.qty_in_stock < 10).length,
        0
      ),
    0
  );

  return (
    <DashboardLayout
      title="Master Inventory Control"
      subtitle="Manage Product, ProductItem, and ProductVariant stock in one synchronized command surface."
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Master Inventory' },
      ]}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <PackageOpen className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-slate-500">Products</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{products.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-slate-500">Tracked Variants</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{totalVariants}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-amber-700">Low Stock Variants</p>
            <p className="mt-1 text-3xl font-black text-amber-900">{lowStockVariants}</p>
          </div>
        </section>

        <InventoryTable
          products={products}
          productTypes={options.productTypes}
          brands={options.brands}
          colors={options.colors}
          sizes={options.sizes}
          filters={filters}
        />
      </div>
    </DashboardLayout>
  );
}
