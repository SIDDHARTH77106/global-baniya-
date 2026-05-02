'use client';

import { FormEvent, Fragment, useMemo, useOptimistic, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  PackagePlus,
  Save,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  createProductBundle,
  updateProductItemSalePrice,
  updateVariantStock,
} from '@/app/actions/inventory.actions';
import { useToast } from '@/components/providers/ToastProvider';

export type InventoryProduct = {
  product_id: string;
  product_name: string;
  product_desc: string | null;
  original_price: number;
  sale_price: number | null;
  brand: { brand_name: string } | null;
  productType: { type_name: string };
  productItems: Array<{
    product_item_id: string;
    product_code: string;
    original_price: number;
    sale_price: number | null;
    color: { color_name: string } | null;
    productVariants: Array<{
      variant_id: string;
      qty_in_stock: number;
      sizeOption: { size_name: string };
    }>;
  }>;
};

type InventoryOption = {
  id: string;
  label: string;
};

type InventoryFilters = {
  query: string;
  productTypeId: string;
  stockStatus: 'all' | 'low' | 'out';
};

type InventoryTableProps = {
  products: InventoryProduct[];
  productTypes: InventoryOption[];
  brands: InventoryOption[];
  colors: InventoryOption[];
  sizes: InventoryOption[];
  filters: InventoryFilters;
};

type OptimisticAction =
  | { type: 'stock'; variantId: string; qty: number }
  | { type: 'price'; productItemId: string; salePrice: number };

function formatCurrency(value: number | null) {
  if (value === null) return 'Not set';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

function stockBadge(qty: number) {
  if (qty === 0) return 'border-red-200 bg-red-50 text-red-700';
  if (qty < 10) return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700';
}

function inventoryReducer(products: InventoryProduct[], action: OptimisticAction) {
  return products.map((product) => ({
    ...product,
    productItems: product.productItems.map((item) => {
      if (action.type === 'price' && item.product_item_id === action.productItemId) {
        return { ...item, sale_price: action.salePrice };
      }

      return {
        ...item,
        productVariants: item.productVariants.map((variant) =>
          action.type === 'stock' && variant.variant_id === action.variantId
            ? { ...variant, qty_in_stock: action.qty }
            : variant
        ),
      };
    }),
  }));
}

export default function InventoryTable({
  products,
  productTypes,
  brands,
  colors,
  sizes,
  filters,
}: InventoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [optimisticProducts, addOptimisticUpdate] = useOptimistic(products, inventoryReducer);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedVariantIds, setSelectedVariantIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState(filters.query);
  const [productTypeId, setProductTypeId] = useState(filters.productTypeId);
  const [stockStatus, setStockStatus] = useState(filters.stockStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const createProductFormRef = useRef<HTMLFormElement>(null);

  const inventorySummary = useMemo(() => {
    return optimisticProducts.reduce(
      (summary, product) => {
        product.productItems.forEach((item) => {
          summary.items += 1;
          item.productVariants.forEach((variant) => {
            summary.variants += 1;
            summary.units += variant.qty_in_stock;
          });
        });
        return summary;
      },
      { items: 0, variants: 0, units: 0 }
    );
  }, [optimisticProducts]);

  const allVisibleVariantIds = useMemo(
    () =>
      optimisticProducts.flatMap((product) =>
        product.productItems.flatMap((item) => item.productVariants.map((variant) => variant.variant_id))
      ),
    [optimisticProducts]
  );

  function applyFilters(next: Partial<InventoryFilters>) {
    const merged = {
      query,
      productTypeId,
      stockStatus,
      ...next,
    };
    const params = new URLSearchParams();
    if (merged.query.trim()) params.set('q', merged.query.trim());
    if (merged.productTypeId) params.set('type', merged.productTypeId);
    if (merged.stockStatus !== 'all') params.set('stock', merged.stockStatus);
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function toggleProduct(productId: string) {
    setExpandedProducts((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  function toggleItem(productItemId: string) {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(productItemId)) next.delete(productItemId);
      else next.add(productItemId);
      return next;
    });
  }

  function toggleVariantSelection(variantIds: string[], checked: boolean) {
    setSelectedVariantIds((current) => {
      const next = new Set(current);
      variantIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  }

  function handleStockSubmit(event: FormEvent<HTMLFormElement>, variantId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQty = Number(formData.get('qty_in_stock'));
    const action: OptimisticAction = { type: 'stock', variantId, qty: nextQty };

    setPendingKey(`stock-${variantId}`);
    startTransition(() => {
      addOptimisticUpdate(action);
      void updateVariantStock(variantId, nextQty)
        .then(() => {
          toast.success('Stock updated successfully.');
          router.refresh();
        })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Stock update failed.');
        })
        .finally(() => setPendingKey(null));
    });
  }

  function handlePriceSubmit(event: FormEvent<HTMLFormElement>, productItemId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextPrice = Number(formData.get('sale_price'));
    const action: OptimisticAction = { type: 'price', productItemId, salePrice: nextPrice };

    setPendingKey(`price-${productItemId}`);
    startTransition(() => {
      addOptimisticUpdate(action);
      void updateProductItemSalePrice(productItemId, nextPrice)
        .then(() => {
          toast.success('Sale price updated successfully.');
          router.refresh();
        })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Price update failed.');
        })
        .finally(() => setPendingKey(null));
    });
  }

  function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);

    const rawBrandId = formData.get('brandId');
    const rawColorId = formData.get('colorId');
    const rawSizeId = String(formData.get('sizeId') || '');
    const validationErrors = validateCreateProductForm(formData, 3);

    if (validationErrors.length > 0) {
      toast.error(`Please fix before creating: ${validationErrors.join(', ')}.`);
      return;
    }

    setPendingKey('create-product');
    startTransition(() => {
      void createProductBundle({
        productName: String(formData.get('productName') || ''),
        productTypeId: String(formData.get('productTypeId') || ''),
        brandId: rawBrandId ? String(rawBrandId) : undefined,
        imageUrl: String(formData.get('imageUrl') || ''),
        originalPrice: Number(formData.get('originalPrice')),
        productSalePrice: formData.get('productSalePrice') ? Number(formData.get('productSalePrice')) : undefined,
        description: String(formData.get('description') || ''),
        productCode: String(formData.get('productCode') || ''),
        colorId: rawColorId ? String(rawColorId) : undefined,
        itemOriginalPrice: Number(formData.get('itemOriginalPrice')),
        itemSalePrice: formData.get('itemSalePrice') ? Number(formData.get('itemSalePrice')) : undefined,
        sizeId: rawSizeId && rawSizeId !== 'DEFAULT' ? rawSizeId : undefined,
        qtyInStock: Number(formData.get('qtyInStock')),
      })
        .then(() => {
          toast.success('Product created successfully.');
          setIsModalOpen(false);
          setModalStep(1);
          form.reset();
          router.refresh();
        })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Product creation failed.');
        })
        .finally(() => setPendingKey(null));
    });
  }

  function validateCreateProductForm(formData: FormData, throughStep: number) {
    const missing: string[] = [];
    const productName = String(formData.get('productName') || '').trim();
    const productTypeId = String(formData.get('productTypeId') || '').trim();
    const originalPriceValue = String(formData.get('originalPrice') || '').trim();
    const originalPrice = Number(originalPriceValue);
    const productCode = String(formData.get('productCode') || '').trim();
    const itemOriginalPriceValue = String(formData.get('itemOriginalPrice') || '').trim();
    const itemOriginalPrice = Number(itemOriginalPriceValue);
    const qtyInStockValue = String(formData.get('qtyInStock') || '').trim();
    const qtyInStock = Number(qtyInStockValue);

    if (throughStep >= 1) {
      if (!productName) missing.push('product name');
      if (!productTypeId) missing.push('product type');
    }

    if (throughStep >= 2) {
      if (!originalPriceValue || !Number.isFinite(originalPrice) || originalPrice < 0) missing.push('product original price');
      if (!productCode) missing.push('product code');
    }

    if (throughStep >= 3) {
      if (!itemOriginalPriceValue || !Number.isFinite(itemOriginalPrice) || itemOriginalPrice < 0) missing.push('item original price');
      if (!qtyInStockValue || !Number.isInteger(qtyInStock) || qtyInStock < 0) missing.push('qty_in_stock');
    }

    return missing;
  }

  function continueCreateProduct() {
    const form = createProductFormRef.current;
    if (!form) return;

    const nextStep = modalStep + 1;
    const formData = new FormData(form);
    const missing = validateCreateProductForm(formData, modalStep);

    if (missing.length > 0) {
      toast.error(`Please fill required fields in Step ${modalStep}: ${missing.join(', ')}.`);
      return;
    }

    setModalStep(Math.min(3, nextStep));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
          <div>
            <p className="text-2xl font-black text-slate-950">{optimisticProducts.length}</p>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Products</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-950">{inventorySummary.items}</p>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Items</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-950">{inventorySummary.units}</p>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Units</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              if (selectedVariantIds.size === 0) {
                toast.error('Select at least one variant before using bulk stock update.');
                return;
              }
              toast.success(`Bulk stock update placeholder ready for ${selectedVariantIds.size} variants.`);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bulk Update Stock ({selectedVariantIds.size})
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <PackagePlus className="h-4 w-4" />
            Add New Product
          </button>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters({ query });
        }}
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_180px_auto]"
      >
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product_name or product_code"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <select
          value={productTypeId}
          onChange={(event) => {
            setProductTypeId(event.target.value);
            applyFilters({ productTypeId: event.target.value });
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">All product types</option>
          {productTypes.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={stockStatus}
          onChange={(event) => {
            const nextStatus = event.target.value as InventoryFilters['stockStatus'];
            setStockStatus(nextStatus);
            applyFilters({ stockStatus: nextStatus });
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">Show all stock</option>
          <option value="low">Low stock (&lt; 10)</option>
          <option value="out">Out of stock</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={allVisibleVariantIds.length > 0 && allVisibleVariantIds.every((id) => selectedVariantIds.has(id))}
                    onChange={(event) => toggleVariantSelection(allVisibleVariantIds, event.target.checked)}
                    aria-label="Select all visible variants"
                  />
                </th>
                <th className="w-12 p-4" />
                <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Product</th>
                <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Hierarchy</th>
                <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Base Price</th>
                <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Units</th>
                <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {optimisticProducts.map((product) => {
                const isExpanded = expandedProducts.has(product.product_id);
                const productVariantIds = product.productItems.flatMap((item) =>
                  item.productVariants.map((variant) => variant.variant_id)
                );
                const totalUnits = product.productItems.reduce(
                  (sum, item) =>
                    sum + item.productVariants.reduce((variantSum, variant) => variantSum + variant.qty_in_stock, 0),
                  0
                );
                const variantCount = product.productItems.reduce((sum, item) => sum + item.productVariants.length, 0);

                return (
                  <Fragment key={product.product_id}>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={productVariantIds.length > 0 && productVariantIds.every((id) => selectedVariantIds.has(id))}
                          onChange={(event) => toggleVariantSelection(productVariantIds, event.target.checked)}
                          aria-label={`Select variants for ${product.product_name}`}
                        />
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleProduct(product.product_id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          aria-label={isExpanded ? 'Collapse product' : 'Expand product'}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-slate-950">{product.product_name}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {product.brand?.brand_name ?? 'No brand'} / {product.productType.type_name}
                        </p>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-600">
                        {product.productItems.length} items / {variantCount} variants
                      </td>
                      <td className="p-4 text-sm font-black text-slate-950">
                        {formatCurrency(product.sale_price ?? product.original_price)}
                      </td>
                      <td className="p-4 text-sm font-black text-slate-950">{totalUnits}</td>
                      <td className="p-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${stockBadge(totalUnits)}`}>
                          {totalUnits === 0 ? 'Out of stock' : totalUnits < 10 ? 'Low stock' : 'Healthy'}
                        </span>
                      </td>
                    </tr>

                    {isExpanded &&
                      product.productItems.map((item) => {
                        const itemExpanded = expandedItems.has(item.product_item_id);
                        const itemUnits = item.productVariants.reduce((sum, variant) => sum + variant.qty_in_stock, 0);

                        return (
                          <Fragment key={item.product_item_id}>
                            <tr className="bg-slate-50/70">
                              <td className="p-4" />
                              <td className="p-4" />
                              <td className="p-4">
                                <button
                                  type="button"
                                  onClick={() => toggleItem(item.product_item_id)}
                                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-black text-slate-700 transition hover:bg-white hover:text-emerald-700"
                                >
                                  {itemExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  {item.product_code}
                                </button>
                                <p className="ml-8 mt-1 text-xs font-bold text-slate-500">
                                  Color: {item.color?.color_name ?? 'Default'}
                                </p>
                              </td>
                              <td className="p-4 text-sm font-bold text-slate-600">
                                {item.productVariants.length} sizes
                              </td>
                              <td className="p-4">
                                <form onSubmit={(event) => handlePriceSubmit(event, item.product_item_id)} className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    name="sale_price"
                                    defaultValue={item.sale_price ?? item.original_price}
                                    className="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                  />
                                  <button
                                    type="submit"
                                    disabled={isPending && pendingKey === `price-${item.product_item_id}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-emerald-700 disabled:opacity-70"
                                    aria-label="Save sale price"
                                  >
                                    {pendingKey === `price-${item.product_item_id}` ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                  </button>
                                </form>
                              </td>
                              <td className="p-4 text-sm font-black text-slate-950">{itemUnits}</td>
                              <td className="p-4">
                                <span className={`rounded-full border px-3 py-1 text-xs font-black ${stockBadge(itemUnits)}`}>
                                  Item stock
                                </span>
                              </td>
                            </tr>

                            {itemExpanded &&
                              item.productVariants.map((variant) => (
                                <tr key={variant.variant_id} className="bg-white">
                                  <td className="p-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedVariantIds.has(variant.variant_id)}
                                      onChange={(event) => toggleVariantSelection([variant.variant_id], event.target.checked)}
                                      aria-label={`Select ${item.product_code} ${variant.sizeOption.size_name}`}
                                    />
                                  </td>
                                  <td className="p-4" />
                                  <td className="p-4 pl-16 text-sm font-bold text-slate-700">
                                    Size: {variant.sizeOption.size_name}
                                  </td>
                                  <td className="p-4 font-mono text-xs font-bold text-slate-500">
                                    {variant.variant_id.slice(0, 8)}
                                  </td>
                                  <td className="p-4 text-sm font-bold text-slate-500">
                                    {formatCurrency(item.sale_price ?? item.original_price)}
                                  </td>
                                  <td className="p-4">
                                    <form onSubmit={(event) => handleStockSubmit(event, variant.variant_id)} className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min={0}
                                        name="qty_in_stock"
                                        defaultValue={variant.qty_in_stock}
                                        className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                      />
                                      <button
                                        type="submit"
                                        disabled={isPending && pendingKey === `stock-${variant.variant_id}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-70"
                                        aria-label="Save stock"
                                      >
                                        {pendingKey === `stock-${variant.variant_id}` ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Save className="h-4 w-4" />
                                        )}
                                      </button>
                                    </form>
                                  </td>
                                  <td className="p-4">
                                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${stockBadge(variant.qty_in_stock)}`}>
                                      {variant.qty_in_stock} left
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </Fragment>
                        );
                      })}
                  </Fragment>
                );
              })}

              {optimisticProducts.length === 0 && (
                <tr>
                  <td className="p-10 text-center text-sm font-bold text-slate-500" colSpan={7}>
                    No products match the current inventory filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Step {modalStep} of 3</p>
                <h2 className="text-xl font-black text-slate-950">Add New Product</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form ref={createProductFormRef} onSubmit={handleCreateProduct} className="p-6" noValidate>
              <div className={modalStep === 1 ? 'grid gap-4' : 'hidden'}>
                <label className="text-sm font-black text-slate-700">
                  Product name <span className="text-red-600">*</span>
                  <input name="productName" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                </label>
                <label className="text-sm font-black text-slate-700">
                  Product Image URL
                  <input
                    name="imageUrl"
                    placeholder="https://example.com/product-image.jpg"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-black text-slate-700">
                    Product type <span className="text-red-600">*</span>
                    <select name="productTypeId" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                      <option value="">{productTypes.length === 0 ? 'No product types available' : 'Select type'}</option>
                      {productTypes.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-black text-slate-700">
                    Brand
                    <select name="brandId" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                      <option value="">{brands.length === 0 ? 'No brands yet - continue without brand' : 'No brand'}</option>
                      {brands.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <textarea
                  name="description"
                  placeholder="Product description"
                  className="min-h-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className={modalStep === 2 ? 'grid gap-4' : 'hidden'}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-black text-slate-700">
                    Product original price <span className="text-red-600">*</span>
                    <input name="originalPrice" type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                  <label className="text-sm font-black text-slate-700">
                    Product sale price
                    <input name="productSalePrice" type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-black text-slate-700">
                    Product code <span className="text-red-600">*</span>
                    <input name="productCode" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                  <label className="text-sm font-black text-slate-700">
                    Color
                    <select name="colorId" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                      <option value="">{colors.length === 0 ? 'No colors yet - use default' : 'Default'}</option>
                      {colors.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className={modalStep === 3 ? 'grid gap-4' : 'hidden'}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-black text-slate-700">
                    Item original price <span className="text-red-600">*</span>
                    <input name="itemOriginalPrice" type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                  <label className="text-sm font-black text-slate-700">
                    Item sale price
                    <input name="itemSalePrice" type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-black text-slate-700">
                    Size
                    <select name="sizeId" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                      <option value="DEFAULT">Free Size / Default</option>
                      {sizes.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-black text-slate-700">
                    qty_in_stock <span className="text-red-600">*</span>
                    <input name="qtyInStock" type="number" min={0} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setModalStep((step) => Math.max(1, step - 1))}
                  disabled={modalStep === 1}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Back
                </button>
                {modalStep < 3 ? (
                  <button
                    type="button"
                    onClick={continueCreateProduct}
                    className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={pendingKey === 'create-product'}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {pendingKey === 'create-product' && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Product
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
