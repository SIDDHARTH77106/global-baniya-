import { Prisma } from '@prisma/client';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import FilterSidebar from '@/components/storefront/FilterSidebar';
import StorefrontProductCard from '@/components/storefront/StorefrontProductCard';

export const dynamic = 'force-dynamic';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return undefined;
  return typeof value === 'number' ? value : value.toNumber();
}

function readList(value?: string) {
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

function parseMoney(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim();
  const categoryIds = readList(params.category);
  const brandIds = readList(params.brand);
  const minPrice = parseMoney(params.minPrice);
  const maxPrice = parseMoney(params.maxPrice);

  const priceFilter =
    minPrice !== undefined || maxPrice !== undefined
      ? {
          gte: minPrice,
          lte: maxPrice,
        }
      : undefined;

  const where: Prisma.ProductWhereInput = {
    AND: [
      query
        ? {
            OR: [
              { product_name: { contains: query } },
              { product_desc: { contains: query } },
              { brand: { brand_name: { contains: query } } },
              { productType: { type_name: { contains: query } } },
            ],
          }
        : {},
      categoryIds.length > 0
        ? {
            OR: [
              { product_type: { in: categoryIds } },
              { productType: { type_name: { in: categoryIds } } },
            ],
          }
        : {},
      brandIds.length > 0
        ? {
            OR: [
              { brand_id: { in: brandIds } },
              { brand: { brand_name: { in: brandIds } } },
            ],
          }
        : {},
      priceFilter
        ? {
            OR: [
              { sale_price: priceFilter },
              { original_price: priceFilter },
              { productItems: { some: { sale_price: priceFilter } } },
              { productItems: { some: { original_price: priceFilter } } },
            ],
          }
        : {},
    ],
  };

  const [products, categories, brands, priceStats] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        brand: true,
        productType: true,
        productImages: true,
        reviews: true,
        productItems: {
          include: {
            color: true,
            productVariants: {
              include: { sizeOption: true },
              orderBy: [{ qty_in_stock: 'desc' }, { variant_id: 'asc' }],
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    }),
    prisma.productType.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { type_name: 'asc' },
    }),
    prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { brand_name: 'asc' },
    }),
    prisma.product.aggregate({
      _max: {
        original_price: true,
        sale_price: true,
      },
    }),
  ]);

  const maxAvailablePrice = Math.ceil(
    Math.max(toNumber(priceStats._max.original_price) ?? 0, toNumber(priceStats._max.sale_price) ?? 0, 100)
  );

  const cards = products
    .map((product) => {
      const productItem =
        product.productItems.find((item) => item.productVariants.some((variant) => variant.qty_in_stock > 0)) ??
        product.productItems[0];
      const variant =
        productItem?.productVariants.find((itemVariant) => itemVariant.qty_in_stock > 0) ??
        productItem?.productVariants[0];

      if (!productItem || !variant) return null;

      const price =
        toNumber(productItem.sale_price) ??
        toNumber(product.sale_price) ??
        toNumber(productItem.original_price) ??
        toNumber(product.original_price) ??
        0;
      const originalPrice =
        toNumber(productItem.original_price) ??
        toNumber(product.original_price) ??
        price;

      return {
        productId: product.product_id,
        variantId: variant.variant_id,
        name: product.product_name,
        brand: product.brand?.brand_name,
        category: product.productType.type_name,
        image: product.productImages[0]?.image_filename,
        size: variant.sizeOption.size_name,
        color: productItem.color?.color_name,
        price,
        originalPrice,
        stock: variant.qty_in_stock,
        rating:
          product.reviews.length > 0
            ? Math.min(5, Math.max(1, 4 + product.reviews.length / 20))
            : 4.4,
      };
    })
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Global Baniya Storefront</p>
            <h1 className="mt-1 text-3xl font-black text-gray-950">
              {query ? `Search results for "${query}"` : 'Browse Products'}
            </h1>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              Showing {cards.length} products from live Prisma inventory.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
            <Search className="h-4 w-4" />
            Server-filtered results
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            categories={categories.map((category) => ({
              id: category.product_type_id,
              name: category.type_name,
              count: category._count.products,
            }))}
            brands={brands.map((brand) => ({
              id: brand.brand_id,
              name: brand.brand_name,
              count: brand._count.products,
            }))}
            maxPrice={maxAvailablePrice}
          />

          <main>
            {cards.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                <h2 className="text-xl font-black text-gray-950">No products found</h2>
                <p className="mt-2 text-sm font-semibold text-gray-500">
                  Try removing filters or searching a broader product name.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {cards.map((product) => (
                  <StorefrontProductCard key={product.variantId} {...product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
