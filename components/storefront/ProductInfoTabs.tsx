'use client';

import { useState } from 'react';

type ProductInfoTabsProps = {
  description?: string | null;
  careInstructions?: string | null;
  keyFeatures: string[];
};

const shippingInfo = [
  'Fast local delivery from nearby inventory partners.',
  'Stock is checked at variant level before checkout.',
  'Easy support for damaged, missing, or incorrect items.',
];

export default function ProductInfoTabs({ description, careInstructions, keyFeatures }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Care Instructions', 'Key Features', 'Shipping Info'];

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex overflow-x-auto border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-4 text-sm font-black transition ${
              activeTab === tab
                ? 'border-b-2 border-emerald-600 text-emerald-700'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 text-sm font-medium leading-7 text-gray-600">
        {activeTab === 'Description' && (
          <p>{description || 'Detailed product description will be added by the catalog team.'}</p>
        )}

        {activeTab === 'Care Instructions' && (
          <p>{careInstructions || 'Store in a cool, dry place and follow package instructions.'}</p>
        )}

        {activeTab === 'Key Features' && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {(keyFeatures.length > 0 ? keyFeatures : ['Fresh local inventory', 'Variant-level stock tracking', 'Quality checked before dispatch']).map((feature) => (
              <li key={feature} className="rounded-lg bg-gray-50 px-4 py-3 font-bold text-gray-700">
                {feature}
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'Shipping Info' && (
          <ul className="space-y-3">
            {shippingInfo.map((item) => (
              <li key={item} className="font-semibold text-gray-700">{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
