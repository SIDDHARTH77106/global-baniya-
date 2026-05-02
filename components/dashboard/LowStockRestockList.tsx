'use client';

import { FormEvent, useOptimistic, useState, useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateVariantStock } from '@/app/actions/inventory.actions';
import { useToast } from '@/components/providers/ToastProvider';

export type LowStockAlertItem = {
  variant_id: string;
  qty_in_stock: number;
  size_name: string;
  product_name: string;
  product_code: string;
  brand_name: string | null;
  type_name: string;
  color_name: string | null;
};

type LowStockRestockListProps = {
  items: LowStockAlertItem[];
};

export default function LowStockRestockList({ items }: LowStockRestockListProps) {
  const router = useRouter();
  const toast = useToast();
  const [optimisticItems, removeOptimisticItem] = useOptimistic(
    items,
    (currentItems, variantId: string) => currentItems.filter((item) => item.variant_id !== variantId)
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function restockItem(event: FormEvent<HTMLFormElement>, variantId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const qty = Number(formData.get('qty_in_stock'));

    setPendingId(variantId);
    startTransition(() => {
      removeOptimisticItem(variantId);
      void updateVariantStock(variantId, qty)
        .then(() => {
          toast.success('Low-stock item restocked successfully.');
          router.refresh();
        })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Restock failed.');
        })
        .finally(() => setPendingId(null));
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Product</th>
            <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">ProductItem</th>
            <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Variant</th>
            <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Current Stock</th>
            <th className="p-4 text-right text-xs font-black uppercase tracking-wide text-slate-500">Restock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {optimisticItems.map((item) => (
            <tr key={item.variant_id} className="hover:bg-slate-50">
              <td className="p-4">
                <p className="font-black text-slate-950">{item.product_name}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {item.brand_name ?? 'No brand'} / {item.type_name}
                </p>
              </td>
              <td className="p-4">
                <p className="font-mono text-xs font-black text-slate-700">{item.product_code}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{item.color_name ?? 'Default color'}</p>
              </td>
              <td className="p-4 text-sm font-black text-slate-700">{item.size_name}</td>
              <td className="p-4">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                  {item.qty_in_stock} left
                </span>
              </td>
              <td className="p-4">
                <form onSubmit={(event) => restockItem(event, item.variant_id)} className="flex justify-end gap-2">
                  <input
                    type="number"
                    min={0}
                    name="qty_in_stock"
                    defaultValue={Math.max(10, item.qty_in_stock + 10)}
                    className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isPending && pendingId === item.variant_id}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {pendingId === item.variant_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Restock
                  </button>
                </form>
              </td>
            </tr>
          ))}

          {optimisticItems.length === 0 && (
            <tr>
              <td className="p-8 text-center text-sm font-bold text-slate-500" colSpan={5}>
                No critical stock alerts. Every ProductVariant currently has at least 10 units.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
