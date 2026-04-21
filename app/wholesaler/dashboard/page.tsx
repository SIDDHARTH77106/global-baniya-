"use client";
import { Truck, LogOut } from "lucide-react";
import Link from "next/link";

export default function WholesalerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Wholesaler Portal</h1>
              <p className="text-sm text-gray-500">Manage bulk orders and supply chain</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-red-600 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition">
            <LogOut className="w-4 h-4" /> Exit
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="font-bold text-lg">Bulk Orders Pending</h3>
            <p className="text-3xl font-black text-purple-600 mt-2">4</p>
          </div>
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="font-bold text-lg">Total Retailers Connected</h3>
            <p className="text-3xl font-black text-green-600 mt-2">28</p>
          </div>
        </div>
      </div>
    </div>
  );
}