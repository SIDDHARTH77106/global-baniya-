'use client';

import { ShoppingCart, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartProductData, useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/providers/ToastProvider';

type AddToCartButtonProps = {
  variantId: string;
  productData: CartProductData;
  qty?: number;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'lg';
  buyNow?: boolean;
};

export default function AddToCartButton({
  variantId,
  productData,
  qty = 1,
  disabled,
  label = 'Add to Cart',
  size = 'sm',
  buyNow = false,
}: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toast = useToast();
  const router = useRouter();
  const isDisabled = disabled || !variantId || (productData.stock ?? 1) <= 0;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isDisabled) return;
        addToCart(variantId, qty, productData);
        toast.success(`${productData.name} added to cart.`);
        if (buyNow) router.push('/cart');
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
        size === 'lg'
          ? buyNow
            ? 'border border-emerald-200 bg-white px-7 py-4 text-base text-emerald-700 hover:bg-emerald-50'
            : 'bg-emerald-600 px-8 py-4 text-base text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'
          : 'border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white'
      }`}
    >
      {buyNow ? <Zap className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {isDisabled ? 'Out of Stock' : label}
    </button>
  );
}
