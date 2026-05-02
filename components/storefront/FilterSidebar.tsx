'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

type FilterOption = {
  id: string;
  name: string;
  count?: number;
};

type FilterSidebarProps = {
  categories: FilterOption[];
  brands: FilterOption[];
  maxPrice: number;
};

function readMultiValue(value: string | null) {
  return value ? value.split(',').filter(Boolean) : [];
}

export default function FilterSidebar({ categories, brands, maxPrice }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value?: string | string[]) {
    const params = new URLSearchParams(searchParams.toString());
    const normalized = Array.isArray(value) ? value.filter(Boolean).join(',') : value;

    if (normalized) {
      params.set(key, normalized);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleMulti(key: 'category' | 'brand', id: string) {
    const selected = readMultiValue(searchParams.get(key));
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    updateParam(key, next);
  }

  const selectedCategories = readMultiValue(searchParams.get('category'));
  const selectedBrands = readMultiValue(searchParams.get('brand'));
  const minPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';

  return (
    <aside className="sticky top-28 h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-emerald-700" />
          <h2 className="text-base font-black text-gray-950">Filters</h2>
        </div>
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="inline-flex items-center gap-1 text-xs font-black text-gray-500 transition hover:text-emerald-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-7">
        <section>
          <h3 className="mb-3 text-sm font-black text-gray-900">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-gray-700">
                <span className="flex min-w-0 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleMulti('category', category.id)}
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                  />
                  <span className="truncate">{category.name}</span>
                </span>
                {typeof category.count === 'number' && <span className="text-xs text-gray-400">{category.count}</span>}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-black text-gray-900">Price Range</h3>
          <input
            type="range"
            min={0}
            max={Math.max(maxPrice, 100)}
            value={Number(currentMaxPrice || maxPrice || 0)}
            onChange={(event) => updateParam('maxPrice', event.target.value)}
            className="mb-3 w-full accent-emerald-600"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(event) => updateParam('minPrice', event.target.value)}
              placeholder="Min"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <input
              type="number"
              min={0}
              value={currentMaxPrice}
              onChange={(event) => updateParam('maxPrice', event.target.value)}
              placeholder="Max"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-black text-gray-900">Brands</h3>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand.id} className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-gray-700">
                <span className="flex min-w-0 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleMulti('brand', brand.id)}
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                  />
                  <span className="truncate">{brand.name}</span>
                </span>
                {typeof brand.count === 'number' && <span className="text-xs text-gray-400">{brand.count}</span>}
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
