'use client';

import { useState } from 'react';
import { FileText, X } from 'lucide-react';

export default function ChallanAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
      >
        <FileText className="h-4 w-4" />
        Generate Delivery Challan / E-Way Bill
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-950">Document Generator</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm font-semibold leading-6 text-slate-600">
              Placeholder ready for GST invoice, delivery challan, and E-Way Bill generation once shipment and tax models are connected.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
