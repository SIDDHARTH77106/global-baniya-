'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Boxes, Clock3, History, ImageIcon, IndianRupee, PackageCheck, SlidersHorizontal } from 'lucide-react';

type TabKey = 'overview' | 'transactions' | 'adjustments' | 'history';

type TabbedProductViewProps = {
  product?: {
    name: string;
    image?: string | null;
    sku?: string;
    price: number;
    stock: number;
    brand?: string | null;
    category?: string | null;
  };
};

const tabs: Array<{ key: TabKey; label: string; icon: typeof Boxes }> = [
  { key: 'overview', label: 'Overview', icon: ImageIcon },
  { key: 'transactions', label: 'Transactions', icon: PackageCheck },
  { key: 'adjustments', label: 'Adjustments', icon: SlidersHorizontal },
  { key: 'history', label: 'History', icon: History },
];

const fallbackProduct = {
  name: 'Aashirvaad Atta 5kg',
  image: null,
  sku: 'GB-DEMO-ATTA-5KG',
  price: 249,
  stock: 42,
  brand: 'Aashirvaad',
  category: 'Grocery',
};

export default function TabbedProductView({ product = fallbackProduct }: TabbedProductViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Zoho-style product drawer</p>
        <h2 className="mt-1 text-lg font-black text-slate-950">{product.name}</h2>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-black transition ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5">
        {activeTab === 'overview' && (
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4" />
              ) : (
                <ImageIcon className="h-12 w-12 text-slate-300" />
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Selling Price', value: `INR ${product.price}`, icon: IndianRupee },
                { label: 'Available Stock', value: product.stock, icon: Boxes },
                { label: 'SKU', value: product.sku ?? 'Not assigned', icon: PackageCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4">
                    <Icon className="mb-3 h-5 w-5 text-emerald-700" />
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 text-xl font-black text-slate-950">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {['SO-1048 reserved 6 units', 'PO-771 received 24 units', 'SO-1033 shipped 4 units'].map((row) => (
              <div key={row} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-sm font-bold text-slate-700">
                <PackageCheck className="h-4 w-4 text-emerald-700" />
                {row}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'adjustments' && (
          <div className="grid gap-3 md:grid-cols-3">
            {['Manual restock +12', 'Damaged stock -2', 'Cycle count corrected +3'].map((row) => (
              <div key={row} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-800">
                {row}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {['Created by Admin', 'Price list updated', 'Warehouse split reviewed'].map((row) => (
              <div key={row} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-600">
                <Clock3 className="h-4 w-4 text-slate-400" />
                {row}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
