'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Truck } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStage((value) => Math.min(3, value + 1));
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
          <h1 className="text-4xl font-semibold text-slate-100">Track Your Order</h1>
          <p className="mt-3 text-slate-400">Your order is on the way. Track delivery progress in real time.</p>
        </div>

        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
          <div className="space-y-7">
            <div className="flex items-center gap-4">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl ${stage >= 0 ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Order confirmed</p>
                <p className="text-slate-300">We have received your payment and started preparation.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl ${stage >= 1 ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Out for delivery</p>
                <p className="text-slate-300">Your order is on its way from the restaurant.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl ${stage >= 2 ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Arriving soon</p>
                <p className="text-slate-300">The delivery partner is close to your address.</p>
              </div>
            </div>
          </div>
        </div>

        <Link href="/" className="inline-flex rounded-3xl bg-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
