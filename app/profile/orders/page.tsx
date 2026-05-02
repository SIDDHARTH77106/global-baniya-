'use client';

import Link from 'next/link';
import { Download, RotateCcw } from 'lucide-react';
import ProfileShell from '@/components/profile/ProfileShell';
import ShipmentTimeline from '@/components/dashboard/ShipmentTimeline';
import { useToast } from '@/components/providers/ToastProvider';

const orders = [
  { id: 'GB-8842', date: '20 April 2026', total: 'INR 450', status: 'Delivered', items: 'Aashirvaad Atta, Maggi + 2 more', active: 3 },
  { id: 'GB-8841', date: '15 April 2026', total: 'INR 1,200', status: 'Shipped', items: 'Fortune Oil, Sugar', active: 2 },
];

export default function OrderHistoryPage() {
  const toast = useToast();

  return (
    <ProfileShell title="My Orders">
      <div className="mb-6 flex justify-end">
        <Link href="/search" className="text-sm font-black text-emerald-700 hover:underline">
          Continue Shopping
        </Link>
      </div>
      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-gray-400">Order #{order.id}</p>
                <h2 className="mt-1 text-lg font-black text-gray-950">{order.items}</h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">{order.date} / {order.total}</p>
              </div>
              <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{order.status}</span>
            </div>
            <ShipmentTimeline active={order.active} />
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => toast.success(`Invoice download queued for ${order.id}.`)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-black text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Download Invoice
              </button>
              <button type="button" onClick={() => toast.success(`Return request started for ${order.id}.`)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-50">
                <RotateCcw className="h-4 w-4" />
                Request Return
              </button>
            </div>
          </article>
        ))}
      </div>
    </ProfileShell>
  );
}
