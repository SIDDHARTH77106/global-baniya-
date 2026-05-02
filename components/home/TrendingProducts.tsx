'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

type StorefrontProduct = {
  id: string;
  productId: string;
  name: string;
  weight: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: string;
  category: string;
  stockQuantity: number;
};

type InventoryItem = {
  id: string;
  product_item_id: string;
  size_name: string;
  qty_in_stock: number;
  product_item: {
    product_code: string;
    color_name: string | null;
    original_price: number;
    sale_price: number;
  };
  product: {
    product_id: string;
    name: string;
    image_filename: string | null;
    type_name: string;
  };
};

type ProductStock = {
  product_id: string;
  qty_in_stock: number;
};

function mapInventoryItem(item: InventoryItem, productStock: ProductStock[]): StorefrontProduct {
  const totalStock = productStock.find((stock) => stock.product_id === item.product.product_id)?.qty_in_stock ?? 0;
  const weightParts = [
    item.product_item.color_name,
    item.size_name,
    item.product_item.product_code,
  ].filter(Boolean);

  return {
    id: item.id,
    productId: item.product.product_id,
    name: item.product.name,
    weight: weightParts.join(' / '),
    price: item.product_item.sale_price,
    oldPrice:
      item.product_item.original_price > item.product_item.sale_price
        ? item.product_item.original_price
        : undefined,
    image: item.product.image_filename || '/globe.svg',
    tag: totalStock <= 5 && totalStock > 0 ? 'LOW STOCK' : undefined,
    category: item.product.type_name,
    stockQuantity: totalStock,
  };
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveProducts() {
      try {
        const response = await fetch('/api/inventory', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Inventory unavailable');
        }

        if (isMounted) {
          const inventory = data.inventory as InventoryItem[];
          const productStock = (data.productStock || []) as ProductStock[];
          setProducts(inventory.slice(0, 10).map((item) => mapInventoryItem(item, productStock)));
        }
      } catch {
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadLiveProducts();
    const intervalId = window.setInterval(loadLiveProducts, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="relative z-0 mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-950">Trending in Pune</h2>
            <p className="mt-1 font-medium text-gray-500">Live stock from local inventory</p>
          </div>
        </div>
        <Link href="/search" className="hidden rounded-lg border border-emerald-200 px-4 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-50 sm:inline-flex">
          View all products
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm font-bold text-gray-500">
          Loading live inventory...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm font-bold text-gray-500">
          No in-stock ProductItem variants are available yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              productId={product.productId}
              name={product.name}
              weight={product.weight}
              price={product.price}
              oldPrice={product.oldPrice}
              image={product.image}
              tag={product.tag}
              stockQuantity={product.stockQuantity}
              productHref={`/product/${product.productId}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
