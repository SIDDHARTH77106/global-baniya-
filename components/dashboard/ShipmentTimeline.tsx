import { CheckCircle2, Circle } from 'lucide-react';

const steps = ['Ordered', 'Packed', 'Shipped', 'Delivered'];

export default function ShipmentTimeline({ active = 2 }: { active?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const done = index <= active;
        return (
          <div key={step} className="rounded-lg border border-gray-200 bg-white p-4">
            {done ? <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" /> : <Circle className="mb-2 h-5 w-5 text-gray-300" />}
            <p className="text-sm font-black text-gray-950">{step}</p>
            <p className="mt-1 text-xs font-semibold text-gray-500">{done ? 'Completed' : 'Pending'}</p>
          </div>
        );
      })}
    </div>
  );
}
