'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/providers/ToastProvider';

export default function CartClient() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const toast = useToast();

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const savings = items.reduce(
    (total, item) => total + Math.max(0, (item.originalPrice ?? item.price) - item.price) * item.quantity,
    0
  );
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 39;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-950">Your cart is empty</h1>
        <p className="mt-2 text-sm font-semibold text-gray-500">Add products from the storefront and they will appear here instantly.</p>
        <Link href="/search" className="mt-6 inline-flex rounded-lg bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-950">Shopping Cart</h1>
            <p className="text-sm font-semibold text-gray-500">{items.length} unique items ready for checkout</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCart();
              toast.success('Cart cleared.');
            }}
            className="text-sm font-black text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.variantId} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                {item.image ? <img src={item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/${item.image}`} alt={item.name} className="h-full w-full object-contain p-2" /> : <span className="font-black text-emerald-700">GB</span>}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 font-black text-gray-950">{item.name}</h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  {[item.brand, item.color, item.size].filter(Boolean).join(' / ') || 'Standard variant'}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button type="button" onClick={() => updateQty(item.variantId, item.quantity - 1)} className="p-2 text-gray-600 hover:text-emerald-700">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.variantId, item.quantity + 1)} className="p-2 text-gray-600 hover:text-emerald-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(item.variantId);
                      toast.success(`${item.name} removed from cart.`);
                    }}
                    className="inline-flex items-center gap-1 text-sm font-black text-red-600 hover:underline"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-gray-950">INR {(item.price * item.quantity).toFixed(0)}</p>
                <p className="text-xs font-bold text-gray-400">INR {item.price.toFixed(0)} each</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-black text-gray-950">Order Summary</h2>
        <div className="space-y-3 border-b border-gray-100 pb-5 text-sm font-bold text-gray-600">
          <div className="flex justify-between"><span>Subtotal</span><span>INR {subtotal.toFixed(0)}</span></div>
          <div className="flex justify-between"><span>Savings</span><span className="text-emerald-700">- INR {savings.toFixed(0)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `INR ${deliveryFee}`}</span></div>
        </div>
        <div className="mt-5 flex justify-between text-xl font-black text-gray-950">
          <span>Total</span>
          <span>INR {total.toFixed(0)}</span>
        </div>
        <button
          type="button"
          onClick={() => toast.success('Checkout module is next: order creation and payment will connect here.')}
          className="mt-6 w-full rounded-lg bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
        >
          Proceed to Checkout
        </button>
      </aside>
    </div>
  );
}
