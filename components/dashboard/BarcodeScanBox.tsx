'use client';

import { FormEvent, useState } from 'react';
import { ScanBarcode } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export default function BarcodeScanBox() {
  const [value, setValue] = useState('');
  const toast = useToast();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(value ? `Barcode ${value} captured for quick stock update.` : 'Ready to scan a barcode.');
    setValue('');
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <label className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
        <ScanBarcode className="h-5 w-5 text-emerald-700" />
        Fast Barcode Scan
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Scan or type SKU / barcode"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        <button type="submit" className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">
          Apply
        </button>
      </div>
    </form>
  );
}
