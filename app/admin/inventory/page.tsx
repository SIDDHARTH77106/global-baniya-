'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Save, AlertCircle, PackageOpen, Loader2 } from 'lucide-react';
import VendorSidebar from '@/components/layout/VendorSidebar';

type InventoryItem = {
  id: string;
  productName: string;
  brand: string | null;
  category: string | null;
  variantName: string;
  variantValue: string;
  value: string;
  unit: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  currency: string;
  stockQuantity: number;
  inStock: boolean;
};

export default function InventoryDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [draftStock, setDraftStock] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadInventory() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/inventory', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load inventory.');
        }

        if (isMounted) {
          const inventory = data.inventory as InventoryItem[];
          setItems(inventory);
          setDraftStock(
            Object.fromEntries(inventory.map((item) => [item.id, item.stockQuantity]))
          );
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load inventory.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return items;

    return items.filter(
      (item) =>
        item.productName.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.variantValue.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const updateStock = async (item: InventoryItem) => {
    const stockQuantity = draftStock[item.id];
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setError('Stock must be a non-negative whole number.');
      return;
    }

    try {
      setError('');
      setSavingId(item.id);
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subVariantId: item.id, stockQuantity }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update stock.');
      }

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, stockQuantity, inStock: stockQuantity > 0 }
            : currentItem
        )
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update stock.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <VendorSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <PackageOpen className="w-8 h-8 text-emerald-600" /> Inventory Control
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Stock and price are maintained at the sub-variant SKU level.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product, variant, or SKU..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 p-12 text-gray-500 font-bold">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading inventory...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-black text-gray-500 uppercase">Product & Variant</th>
                      <th className="p-4 text-xs font-black text-gray-500 uppercase">SKU</th>
                      <th className="p-4 text-xs font-black text-gray-500 uppercase">MRP</th>
                      <th className="p-4 text-xs font-black text-gray-500 uppercase">Stock</th>
                      <th className="p-4 text-xs font-black text-gray-500 uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{item.productName}</p>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 inline-block px-2 py-0.5 rounded mt-1">
                            {item.variantName}: {item.variantValue} - {item.value}
                            {item.unit}
                          </p>
                        </td>
                        <td className="p-4 font-mono text-xs text-gray-600">{item.sku}</td>
                        <td className="p-4 font-black text-gray-900">
                          {item.currency} {item.mrp}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              min={0}
                              value={draftStock[item.id] ?? item.stockQuantity}
                              onChange={(event) =>
                                setDraftStock((currentDraft) => ({
                                  ...currentDraft,
                                  [item.id]: Number(event.target.value),
                                }))
                              }
                              className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-black text-gray-900 outline-none focus:border-emerald-500"
                            />
                            {item.stockQuantity > 10 ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase w-fit">
                                {item.stockQuantity} in stock
                              </span>
                            ) : item.stockQuantity > 0 ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-yellow-100 text-yellow-700 uppercase flex items-center gap-1 w-fit">
                                <AlertCircle className="w-3 h-3" /> Low stock ({item.stockQuantity})
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase w-fit">
                                Out of stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => updateStock(item)}
                            disabled={savingId === item.id || draftStock[item.id] === item.stockQuantity}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {savingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredItems.length === 0 && (
                      <tr>
                        <td className="p-8 text-center text-sm font-bold text-gray-500" colSpan={5}>
                          No inventory items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
