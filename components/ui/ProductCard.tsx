'use client';

import { Plus } from 'lucide-react';

interface ProductCardProps {
  id: string | number;
  name: string;
  weight: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: string;
  stockQuantity?: number;
  onCardClick?: () => void;
}

export default function ProductCard({
  id,
  name,
  weight,
  price,
  oldPrice,
  image,
  tag,
  stockQuantity,
  onCardClick,
}: ProductCardProps) {
  const hasLiveStock = typeof stockQuantity === 'number';
  const isOutOfStock = hasLiveStock && stockQuantity <= 0;

  return (
    <div
      onClick={onCardClick}
      data-product-id={id}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col relative group h-full cursor-pointer"
    >
      {tag && (
        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm z-10">
          {tag}
        </span>
      )}

      <div className="w-full h-32 sm:h-36 bg-[#F4F5F7] rounded-xl mb-4 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
        {image}
      </div>

      <span className="text-[11px] text-gray-500 font-bold mb-1">{weight}</span>
      <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-snug mb-3 line-clamp-2 h-9 sm:h-10">
        {name}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-black text-base sm:text-lg text-gray-950">₹{price}</span>
          {oldPrice && oldPrice > price && (
            <span className="text-[10px] sm:text-xs text-gray-400 font-semibold line-through decoration-gray-300">
              ₹{oldPrice}
            </span>
          )}
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            if (isOutOfStock) return;
            alert(`${name} Added to cart!`);
          }}
          disabled={isOutOfStock}
          className={`border px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-black text-xs sm:text-sm flex items-center gap-1 transition-colors ${
            isOutOfStock
              ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200 hover:border-emerald-600'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              ADD <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
