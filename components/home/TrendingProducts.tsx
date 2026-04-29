'use client';

import { TrendingUp, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Modal from '@/components/ui/Modal';

type StorefrontProduct = {
  id: string;
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
  productName: string;
  category: string | null;
  image: string | null;
  value: string;
  unit: string;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
};

const fallbackProducts: StorefrontProduct[] = [
  {
    id: 'fallback-1',
    name: 'Amul Taaza Toned Fresh Milk',
    weight: '500 ml',
    price: 27,
    oldPrice: 28,
    image: '🥛',
    tag: 'HOT',
    category: 'Dairy',
    stockQuantity: 12,
  },
  {
    id: 'fallback-2',
    name: 'Aashirvaad Shudh Chakki Atta',
    weight: '5 kg',
    price: 210,
    oldPrice: 250,
    image: '🌾',
    tag: '16% OFF',
    category: 'Grocery',
    stockQuantity: 8,
  },
];

function mapInventoryItem(item: InventoryItem): StorefrontProduct {
  return {
    id: item.id,
    name: item.productName,
    weight: `${item.value} ${item.unit}`.trim(),
    price: item.sellingPrice,
    oldPrice: item.mrp > item.sellingPrice ? item.mrp : undefined,
    image: item.image || '🛒',
    tag: item.stockQuantity <= 5 && item.stockQuantity > 0 ? 'LOW STOCK' : undefined,
    category: item.category || 'Grocery',
    stockQuantity: item.stockQuantity,
  };
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<StorefrontProduct[]>(fallbackProducts);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveProducts() {
      try {
        const response = await fetch('/api/inventory', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok || !data.success) return;

        const liveProducts = (data.inventory as InventoryItem[]).slice(0, 10).map(mapInventoryItem);
        if (isMounted && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch {
        // Keep the fallback products visible if the API is unavailable during local setup.
      }
    }

    loadLiveProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (product) => product.category === selectedProduct.category && product.id !== selectedProduct.id
    );
  }, [products, selectedProduct]);

  return (
    <section className="pb-16 max-w-7xl mx-auto px-6 relative z-0">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-950 tracking-tight">Trending in Pune</h2>
            <p className="text-gray-500 font-medium mt-1">Live stock from local inventory</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            weight={product.weight}
            price={product.price}
            oldPrice={product.oldPrice}
            image={product.image}
            tag={product.tag}
            stockQuantity={product.stockQuantity}
            onCardClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="flex flex-col">
            <div className="w-full h-48 bg-[#F4F5F7] rounded-2xl flex items-center justify-center text-8xl mb-4 shadow-inner">
              {selectedProduct.image}
            </div>
            <span className="text-emerald-600 font-black text-xs uppercase mb-1">
              {selectedProduct.category}
            </span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h3>
            <span className="text-gray-500 font-bold mb-4">{selectedProduct.weight}</span>

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="text-3xl font-black text-gray-950">₹{selectedProduct.price}</div>
              <button
                disabled={selectedProduct.stockQuantity <= 0}
                className={`px-6 py-3 rounded-xl font-black shadow-lg transition active:scale-95 flex items-center gap-2 ${
                  selectedProduct.stockQuantity <= 0
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 shadow-none'
                    : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                }`}
              >
                {selectedProduct.stockQuantity <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                {selectedProduct.stockQuantity > 0 && <Plus className="w-5 h-5" />}
              </button>
            </div>

            {relatedProducts.length > 0 && (
              <div>
                <h4 className="text-sm font-black text-gray-900 mb-3">You might also like</h4>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      onClick={() => setSelectedProduct(relatedProduct)}
                      className="min-w-[120px] bg-white border border-gray-100 rounded-xl p-2 cursor-pointer hover:border-emerald-500 transition"
                    >
                      <div className="w-full h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl mb-2">
                        {relatedProduct.image}
                      </div>
                      <p className="text-[10px] font-bold text-gray-800 line-clamp-1">
                        {relatedProduct.name}
                      </p>
                      <p className="text-xs font-black text-emerald-600 mt-1">₹{relatedProduct.price}</p>
                    </div>
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
