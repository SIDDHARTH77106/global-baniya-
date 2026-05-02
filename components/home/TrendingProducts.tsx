'use client';

import { Plus, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Modal from '@/components/ui/Modal';

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
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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
    const intervalId = window.setInterval(loadLiveProducts, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (product) => product.category === selectedProduct.category && product.id !== selectedProduct.id
    );
  }, [products, selectedProduct]);

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
              onCardClick={() => setSelectedProductId(product.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProductId(null)}>
        {selectedProduct && (
          <div className="flex flex-col">
            <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-[#F4F5F7] text-5xl shadow-inner">
              {selectedProduct.image}
            </div>
            <span className="mb-1 text-xs font-black uppercase text-emerald-600">
              {selectedProduct.category}
            </span>
            <h3 className="text-2xl font-black leading-tight text-gray-900">{selectedProduct.name}</h3>
            <span className="mb-4 font-bold text-gray-500">{selectedProduct.weight}</span>

            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-6">
              <div className="text-3xl font-black text-gray-950">INR {selectedProduct.price}</div>
              <button
                disabled={selectedProduct.stockQuantity <= 0}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-black shadow-lg transition active:scale-95 ${
                  selectedProduct.stockQuantity <= 0
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 shadow-none'
                    : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                }`}
              >
                {selectedProduct.stockQuantity <= 0 ? 'Out of Stock' : 'ADD TO CART'}
                {selectedProduct.stockQuantity > 0 && <Plus className="h-5 w-5" />}
              </button>
            </div>

            {relatedProducts.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-black text-gray-900">You might also like</h4>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {relatedProducts.map((relatedProduct) => (
                    <button
                      key={relatedProduct.id}
                      onClick={() => setSelectedProductId(relatedProduct.id)}
                      className="min-w-[120px] rounded-lg border border-gray-100 bg-white p-2 text-left transition hover:border-emerald-500"
                    >
                      <div className="mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-gray-50 text-3xl">
                        {relatedProduct.image}
                      </div>
                      <p className="line-clamp-1 text-[10px] font-bold text-gray-800">{relatedProduct.name}</p>
                      <p className="mt-1 text-xs font-black text-emerald-600">INR {relatedProduct.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
