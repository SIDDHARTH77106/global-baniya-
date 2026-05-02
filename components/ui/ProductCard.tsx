'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/providers/ToastProvider';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  id: string | number;
  productId?: string | number;
  name: string;
  weight: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: string;
  stockQuantity?: number;
  productHref?: string;
  onCardClick?: () => void;
}

export default function ProductCard({
  id,
  productId,
  name,
  weight,
  price,
  oldPrice,
  image,
  tag,
  stockQuantity = 0,
  productHref,
  onCardClick,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toast = useToast();
  const isOutOfStock = stockQuantity <= 0;
  const detailsContent = (
    <>
      <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-[#F4F5F7] text-5xl transition-transform duration-300 group-hover:scale-105 sm:h-36">
        {image}
      </div>

      <span className="mb-1 text-[11px] font-bold text-gray-500">{weight}</span>
      <h3 className="mb-3 h-9 text-xs font-bold leading-snug text-gray-800 line-clamp-2 sm:h-10 sm:text-sm">
        {name}
      </h3>
    </>
  );

  return (
    <div
      onClick={onCardClick}
      data-product-id={id}
      className="group relative flex h-full cursor-pointer flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg"
    >
      {tag && (
        <span className="absolute left-3 top-3 z-10 rounded bg-emerald-600 px-2 py-1 text-[10px] font-black text-white shadow-sm">
          {tag}
        </span>
      )}

      {productHref ? (
        <Link href={productHref} className="block">
          {detailsContent}
        </Link>
      ) : (
        detailsContent
      )}

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-base font-black text-gray-950 sm:text-lg">INR {price}</span>
          {oldPrice && oldPrice > price && (
            <span className="text-[10px] font-semibold text-gray-400 line-through decoration-gray-300 sm:text-xs">
              INR {oldPrice}
            </span>
          )}
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            if (isOutOfStock) return;
            addToCart(String(id), 1, {
              productId: String(productId ?? id),
              name,
              image,
              size: weight,
              price,
              originalPrice: oldPrice,
              stock: stockQuantity,
            });
            toast.success(`${name} added to cart.`);
          }}
          disabled={isOutOfStock}
          className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-black transition-colors sm:px-4 ${
            isOutOfStock
              ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              ADD TO CART <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
