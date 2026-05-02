/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Star } from 'lucide-react';
import AddToCartButton from '@/components/storefront/AddToCartButton';
import type { CartProductData } from '@/store/cartStore';

type StorefrontProductCardProps = {
  productId: string;
  variantId: string;
  name: string;
  brand?: string | null;
  category?: string | null;
  image?: string | null;
  size?: string | null;
  color?: string | null;
  price: number;
  originalPrice?: number | null;
  stock: number;
  rating?: number;
};

function productImageSrc(image?: string | null) {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `/${image}`;
}

export default function StorefrontProductCard({
  productId,
  variantId,
  name,
  brand,
  category,
  image,
  size,
  color,
  price,
  originalPrice,
  stock,
  rating = 4.4,
}: StorefrontProductCardProps) {
  const productData: CartProductData = {
    productId,
    name,
    brand,
    image,
    size,
    color,
    price,
    originalPrice,
    stock,
  };
  const imageSrc = productImageSrc(image);

  return (
    <Link
      href={`/product/${productId}`}
      className="group flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-lg"
    >
      <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
        {stock <= 5 && stock > 0 && (
          <span className="absolute left-3 top-3 rounded bg-amber-500 px-2 py-1 text-[10px] font-black uppercase text-white">
            Low stock
          </span>
        )}
        {imageSrc ? (
          <img src={imageSrc} alt={name} className="h-full w-full object-contain p-4 transition group-hover:scale-105" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700">
            GB
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">{category ?? 'Local essentials'}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-black leading-5 text-gray-950">{name}</h3>
        <p className="mt-1 truncate text-xs font-semibold text-gray-500">
          {[brand, color, size].filter(Boolean).join(' / ') || 'Standard pack'}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-600">
          <Star className="h-3.5 w-3.5 fill-amber-500" />
          {rating.toFixed(1)}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-lg font-black text-gray-950">INR {price.toFixed(0)}</p>
          {originalPrice && originalPrice > price && (
            <p className="text-xs font-semibold text-gray-400 line-through">INR {originalPrice.toFixed(0)}</p>
          )}
        </div>
        <AddToCartButton
          variantId={variantId}
          productData={productData}
          disabled={stock <= 0}
          label="ADD"
        />
      </div>
    </Link>
  );
}
