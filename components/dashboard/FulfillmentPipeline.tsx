import { CheckCircle2, Package, PackageCheck, Truck } from 'lucide-react';

const stages = [
  { label: 'Pick', icon: Package, status: 'Ready' },
  { label: 'Pack', icon: PackageCheck, status: 'Queued' },
  { label: 'Ship', icon: Truck, status: 'Awaiting dispatch' },
];

export default function FulfillmentPipeline() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-950">Order Fulfillment Pipeline</h2>
        <p className="text-sm font-semibold text-slate-500">Bulk order movement: Pick, Pack, Ship.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xl font-black text-slate-950">{stage.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{stage.status}</p>
              {index === 0 && <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-emerald-600" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
