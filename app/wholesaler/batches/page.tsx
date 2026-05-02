import { CalendarClock } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardLayout from '@/components/layout/DashboardLayout';

const batches = [
  { batch: 'MILK-PN-0526', item: 'Daily Milk 1L', expiry: '2026-05-07', stock: 180 },
  { batch: 'ATTA-WH-0426', item: 'Aashirvaad Atta 5kg', expiry: '2026-10-30', stock: 420 },
  { batch: 'OIL-WH-0326', item: 'Fortune Oil 1L', expiry: '2027-03-15', stock: 260 },
];

export default function WholesalerBatchesPage() {
  return (
    <DashboardLayout title="Batch Tracking" subtitle="Batch, expiry, and FIFO visibility for grocery distribution." breadcrumbs={[{ label: 'Wholesaler', href: '/wholesaler/dashboard' }, { label: 'Batch Tracking' }]}>
      <DashboardShell icon={CalendarClock} title="Batch and Expiry Tracking" description="Track grocery inventory by batch number and expiry readiness." eyebrow="Compliance">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['Batch', 'Item', 'Expiry', 'Stock'].map((head) => <th key={head} className="p-4 text-xs font-black uppercase text-slate-500">{head}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((row) => (
                <tr key={row.batch}>
                  <td className="p-4 font-mono text-xs font-black text-slate-700">{row.batch}</td>
                  <td className="p-4 text-sm font-bold text-slate-950">{row.item}</td>
                  <td className="p-4 text-sm font-bold text-slate-600">{row.expiry}</td>
                  <td className="p-4 text-sm font-black text-slate-950">{row.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </DashboardShell>
    </DashboardLayout>
  );
}
