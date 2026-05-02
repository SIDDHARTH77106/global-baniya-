'use client';

import { Truck } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export default function DropshipButton({ productName }: { productName: string }) {
  const toast = useToast();

  return (
    <button
      type="button"
      onClick={() => toast.success(`Dropship request queued for ${productName}.`)}
      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-50"
    >
      <Truck className="h-3.5 w-3.5" />
      Request Dropship
    </button>
  );
}
