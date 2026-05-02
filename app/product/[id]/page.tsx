import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { ArrowLeft, BadgeCheck, ShieldCheck, Star, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductGallery from '@/components/storefront/ProductGallery';
import ProductInfoTabs from '@/components/storefront/ProductInfoTabs';
import ProductPurchasePanel, { ProductVariantOption } from '@/components/storefront/ProductPurchasePanel';
import StorefrontProductCard from '@/components/storefront/StorefrontProductCard';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return undefined;
  return typeof value === 'number' ? value : value.toNumber();
}

function mapImage(image?: string | null) {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `/${image}`;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { product_id: id },
    include: {
      brand: true,
      productType: true,
      productImages: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { date: 'desc' } },
      productAttributes: {
        include: {
          attributeOption: {
            include: { attributeType: true },
          },
        },
      },
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
  });

  if (!product) notFound();

  const variants: ProductVariantOption[] = product.productItems.flatMap((item) =>
    item.productVariants.map((variant) => ({
      variantId: variant.variant_id,
      productItemId: item.product_item_id,
      colorId: item.color_id,
      colorName: item.color?.color_name,
      sizeId: variant.size_id,
      sizeName: variant.sizeOption.size_name,
      productCode: item.product_code,
      price:
        toNumber(item.sale_price) ??
        toNumber(product.sale_price) ??
        toNumber(item.original_price) ??
        toNumber(product.original_price) ??
        0,
      originalPrice:
        toNumber(item.original_price) ??
        toNumber(product.original_price) ??
        toNumber(item.sale_price) ??
        0,
      stock: variant.qty_in_stock,
    }))
  );

  const firstVariant = variants.find((variant) => variant.stock > 0) ?? variants[0];
  const salePrice = firstVariant?.price ?? toNumber(product.sale_price) ?? toNumber(product.original_price) ?? 0;
  const originalPrice = firstVariant?.originalPrice ?? toNumber(product.original_price) ?? salePrice;
  const reviewCount = product.reviews.length;
  const averageRating = reviewCount > 0 ? Math.min(5, Math.max(1, 4 + reviewCount / 20)) : 4.4;
  const images = product.productImages.map((image) => image.image_filename);
  const mainImage = mapImage(images[0]);
  const keyFeatures = product.productAttributes.map(
    (attribute) =>
      `${attribute.attributeOption.attributeType.attribute_name}: ${attribute.attributeOption.attribute_option_name}`
  );

  const relatedProducts = await prisma.product.findMany({
    where: {
      product_id: { not: product.product_id },
      product_type: product.product_type,
    },
    take: 4,
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
      },
    },
  });

  const relatedCards = relatedProducts
    .map((related) => {
      const item =
        related.productItems.find((productItem) => productItem.productVariants.some((variant) => variant.qty_in_stock > 0)) ??
        related.productItems[0];
      const variant =
        item?.productVariants.find((productVariant) => productVariant.qty_in_stock > 0) ??
        item?.productVariants[0];

      if (!item || !variant) return null;

      const price =
        toNumber(item.sale_price) ??
        toNumber(related.sale_price) ??
        toNumber(item.original_price) ??
        toNumber(related.original_price) ??
        0;
      const relatedOriginalPrice =
        toNumber(item.original_price) ??
        toNumber(related.original_price) ??
        price;

      return {
        productId: related.product_id,
        variantId: variant.variant_id,
        name: related.product_name,
        brand: related.brand?.brand_name,
        category: related.productType.type_name,
        image: related.productImages[0]?.image_filename,
        size: variant.sizeOption.size_name,
        color: item.color?.color_name,
        price,
        originalPrice: relatedOriginalPrice,
        stock: variant.qty_in_stock,
        rating: related.reviews.length > 0 ? Math.min(5, Math.max(1, 4 + related.reviews.length / 20)) : 4.4,
      };
    })
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/search" className="mb-5 inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_520px]">
          <ProductGallery productName={product.product_name} images={images} />

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">{product.productType.type_name}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-gray-950 sm:text-4xl">{product.product_name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {product.brand?.brand_name && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-700" />
                  {product.brand.brand_name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                {averageRating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>

            <div className="my-6 border-y border-gray-100 py-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-black text-gray-950">INR {salePrice.toFixed(0)}</span>
                {originalPrice > salePrice && (
                  <span className="pb-1 text-lg font-bold text-gray-400 line-through">INR {originalPrice.toFixed(0)}</span>
                )}
              </div>
              {originalPrice > salePrice && (
                <p className="mt-1 text-sm font-black text-emerald-700">
                  Save INR {(originalPrice - salePrice).toFixed(0)} on this variant
                </p>
              )}
            </div>

            <ProductPurchasePanel
              productId={product.product_id}
              productName={product.product_name}
              brand={product.brand?.brand_name}
              image={mainImage}
              variants={variants}
            />

            <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <Truck className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="text-sm font-black text-gray-900">Fast local delivery</p>
                  <p className="text-xs font-semibold text-gray-500">Fulfilled from nearby stock.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="text-sm font-black text-gray-900">Secure checkout ready</p>
                  <p className="text-xs font-semibold text-gray-500">Cart stores variant-level quantity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <ProductInfoTabs
            description={product.product_desc}
            careInstructions={product.care_instruction}
            keyFeatures={keyFeatures}
          />
        </div>

        {relatedCards.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Related Products</p>
              <h2 className="text-2xl font-black text-gray-950">More from {product.productType.type_name}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCards.map((related) => (
                <StorefrontProductCard key={related.variantId} {...related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
