"use client";

import Link from "next/link";

const dummyOrders = [
  { id: "GB-8842", date: "20 April 2026", total: "₹450", status: "Delivered", items: "Aashirvaad Aata, Maggi + 2 more" },
  { id: "GB-8841", date: "15 April 2026", total: "₹1,200", status: "Cancelled", items: "Fortune Oil, Sugar" },
];

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link href="/" className="text-sm font-semibold text-green-600 hover:underline">
            Continue Shopping →
          </Link>
        </div>

        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row items-center justify-between rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Order #{order.id}</p>
                <h3 className="mt-1 text-lg font-bold text-gray-800">{order.items}</h3>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center sm:text-right">
                  <p className="text-sm text-gray-500">Total Bill</p>
                  <p className="font-bold text-gray-900">{order.total}</p>
                </div>
                
                <div className="w-24 text-center">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <button className="hidden sm:block rounded-lg border-2 border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}