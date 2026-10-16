'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/orderStore';

export default function CheckoutPage() {
  const router = useRouter();
  const selectedItem = useOrderStore((state) => state.selectedItem);

  const total = useMemo(() => selectedItem?.price ?? 0, [selectedItem]);

  if (!selectedItem) {
    return (
      <main className="min-h-screen px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800/70 bg-slate-900/70 p-10 text-center shadow-glow">
          <p className="text-slate-300">No item selected yet.</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-6 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
          <h1 className="text-4xl font-semibold text-slate-100">Checkout</h1>
          <p className="mt-3 text-slate-400">Confirm your order and proceed to secure payment.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
            <h2 className="text-2xl font-semibold text-slate-100">Order summary</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dish</p>
                    <p className="mt-2 text-lg font-semibold text-slate-100">{selectedItem.name}</p>
                    <p className="text-sm text-slate-400">{selectedItem.restaurantName}</p>
                  </div>
                  <p className="text-xl font-semibold text-sky-300">₹{selectedItem.price}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Delivery details</p>
                <p className="mt-2 text-slate-300">Estimated delivery time: {selectedItem.deliveryTime} mins</p>
              </div>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Health score</p>
                <p className="mt-2 text-slate-300">{selectedItem.healthScore}% balanced nutrition score</p>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total</p>
                <p className="mt-3 text-4xl font-semibold text-slate-100">₹{total}</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/payment')}
                className="w-full rounded-3xl bg-sky-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Proceed to Payment
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
