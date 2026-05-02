'use client';

import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import AddToCartButton from '@/components/storefront/AddToCartButton';
import type { CartProductData } from '@/store/cartStore';

export type ProductVariantOption = {
  variantId: string;
  productItemId: string;
  colorId?: string | null;
  colorName?: string | null;
  sizeId: string;
  sizeName: string;
  productCode: string;
  price: number;
  originalPrice: number;
  stock: number;
};

type ProductPurchasePanelProps = {
  productId: string;
  productName: string;
  brand?: string | null;
  image?: string | null;
  variants: ProductVariantOption[];
};

export default function ProductPurchasePanel({
  productId,
  productName,
  brand,
  image,
  variants,
}: ProductPurchasePanelProps) {
  const firstAvailable = variants.find((variant) => variant.stock > 0) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(firstAvailable?.variantId ?? '');
  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.variantId === selectedVariantId) ?? firstAvailable,
    [firstAvailable, selectedVariantId, variants]
  );

  const colors = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    variants.forEach((variant) => {
      const id = variant.colorId || 'standard';
      if (!map.has(id)) map.set(id, { id, name: variant.colorName || 'Standard' });
    });
    return Array.from(map.values());
  }, [variants]);

  const selectedColorId = selectedVariant?.colorId || 'standard';
  const sizesForColor = variants.filter((variant) => (variant.colorId || 'standard') === selectedColorId);

  if (!selectedVariant) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
        No purchasable variant is available for this product.
      </div>
    );
  }

  const productData: CartProductData = {
    productId,
    name: productName,
    brand,
    image,
    color: selectedVariant.colorName,
    size: selectedVariant.sizeName,
    price: selectedVariant.price,
    originalPrice: selectedVariant.originalPrice,
    stock: selectedVariant.stock,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-black text-gray-900">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const targetVariant = variants.find((variant) => (variant.colorId || 'standard') === color.id && variant.stock > 0)
              ?? variants.find((variant) => (variant.colorId || 'standard') === color.id);
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => targetVariant && setSelectedVariantId(targetVariant.variantId)}
                className={`rounded-lg border px-4 py-2 text-sm font-black transition ${
                  selectedColorId === color.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
                }`}
              >
                {color.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-black text-gray-900">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizesForColor.map((variant) => (
            <button
              key={variant.variantId}
              type="button"
              onClick={() => setSelectedVariantId(variant.variantId)}
              disabled={variant.stock <= 0}
              className={`rounded-lg border px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
                selectedVariant.variantId === variant.variantId
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
              }`}
            >
              {variant.sizeName}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
        <span className="text-sm font-black text-gray-700">Quantity</span>
        <div className="flex items-center rounded-lg border border-gray-200 bg-white">
          <button type="button" onClick={() => setQty((current) => Math.max(1, current - 1))} className="p-3 text-gray-600 hover:text-emerald-700">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-black">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((current) => Math.min(selectedVariant.stock, current + 1))}
            className="p-3 text-gray-600 hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          variantId={selectedVariant.variantId}
          productData={productData}
          qty={qty}
          disabled={selectedVariant.stock <= 0}
          size="lg"
        />
        <AddToCartButton
          variantId={selectedVariant.variantId}
          productData={productData}
          qty={qty}
          disabled={selectedVariant.stock <= 0}
          label="Buy Now"
          size="lg"
          buyNow
        />
      </div>

      <p className="text-sm font-bold text-gray-500">
        {selectedVariant.stock > 0 ? `${selectedVariant.stock} units available` : 'This variant is currently out of stock'} · Code {selectedVariant.productCode}
      </p>
    </div>
  );
}
