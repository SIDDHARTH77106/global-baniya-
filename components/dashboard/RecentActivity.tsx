import { Clock3 } from 'lucide-react';
import { prisma } from '@/lib/prisma';

type ActivityItem = {
  id: string;
  updatedAt: Date | null;
  title: string;
  meta: string;
  detail: string;
};

type RawProductActivity = {
  product_id: string;
  product_name: string;
  original_price: unknown;
  sale_price: unknown | null;
  updated_at: Date;
  brand_name: string | null;
  type_name: string;
};

type RawVariantActivity = {
  variant_id: string;
  qty_in_stock: number;
  updated_at: Date;
  product_name: string;
  product_code: string;
  size_name: string;
};

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return 0;
}

function formatDate(value: Date | null) {
  if (!value) return 'Timestamp pending';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(value);
}

async function getTimestampedActivity(): Promise<ActivityItem[]> {
  const [products, variants] = await Promise.all([
    prisma.$queryRawUnsafe<RawProductActivity[]>(`
      SELECT
        p.product_id,
        p.product_name,
        p.original_price,
        p.sale_price,
        p.updated_at,
        b.brand_name,
        pt.type_name
      FROM product p
      INNER JOIN product_type pt ON pt.product_type_id = p.product_type
      LEFT JOIN brand b ON b.brand_id = p.brand_id
      ORDER BY p.updated_at DESC, p.product_name ASC
      LIMIT 5
    `),
    prisma.$queryRawUnsafe<RawVariantActivity[]>(`
      SELECT
        pv.variant_id,
        pv.qty_in_stock,
        pv.updated_at,
        p.product_name,
        pi.product_code,
        so.size_name
      FROM product_variant pv
      INNER JOIN product_item pi ON pi.product_item_id = pv.product_item_id
      INNER JOIN product p ON p.product_id = pi.product_id
      INNER JOIN size_option so ON so.size_id = pv.size_id
      ORDER BY pv.updated_at DESC, pv.variant_id ASC
      LIMIT 5
    `),
  ]);

  return [
    ...products.map((product) => ({
      id: `product-${product.product_id}`,
      updatedAt: product.updated_at,
      title: product.product_name,
      meta: `${product.brand_name ?? 'No brand'} / ${product.type_name}`,
      detail: `Product pricing: INR ${toNumber(product.sale_price ?? product.original_price)}`,
    })),
    ...variants.map((variant) => ({
      id: `variant-${variant.variant_id}`,
      updatedAt: variant.updated_at,
      title: variant.product_name,
      meta: `${variant.product_code} / ${variant.size_name}`,
      detail: `${variant.qty_in_stock} units updated`,
    })),
  ];
}

async function getFallbackActivity(): Promise<ActivityItem[]> {
  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      take: 5,
      orderBy: [{ product_name: 'asc' }],
      include: {
        brand: true,
        productType: true,
      },
    }),
    prisma.productVariant.findMany({
      take: 5,
      orderBy: [{ qty_in_stock: 'asc' }, { variant_id: 'asc' }],
      include: {
        sizeOption: true,
        productItem: {
          include: {
            product: true,
          },
        },
      },
    }),
  ]);

  return [
    ...products.map((product) => ({
      id: `product-${product.product_id}`,
      updatedAt: null,
      title: product.product_name,
      meta: `${product.brand?.brand_name ?? 'No brand'} / ${product.productType.type_name}`,
      detail: `Product pricing: INR ${toNumber(product.sale_price ?? product.original_price)}`,
    })),
    ...variants.map((variant) => ({
      id: `variant-${variant.variant_id}`,
      updatedAt: null,
      title: variant.productItem.product.product_name,
      meta: `${variant.productItem.product_code} / ${variant.sizeOption.size_name}`,
      detail: `${variant.qty_in_stock} units currently in stock`,
    })),
  ];
}

export default async function RecentActivity() {
  let activity: ActivityItem[];

  try {
    activity = await getTimestampedActivity();
  } catch {
    activity = await getFallbackActivity();
  }

  activity = activity
    .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0))
    .slice(0, 5);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-black text-slate-950">Recent Inventory Activity</h2>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {activity.map((item) => (
          <div key={item.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-black text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{item.meta}</p>
              <p className="mt-1 text-xs font-bold text-slate-400">{item.detail}</p>
            </div>
            <time className="text-sm font-bold text-slate-500">{formatDate(item.updatedAt)}</time>
          </div>
        ))}

        {activity.length === 0 && (
          <div className="px-5 py-8 text-center text-sm font-bold text-slate-500">
            No inventory updates have been recorded yet.
          </div>
        )}
      </div>
    </section>
  );
}
