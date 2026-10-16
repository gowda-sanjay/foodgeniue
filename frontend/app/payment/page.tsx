'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrderStore } from '@/store/orderStore';

const paymentSchema = z.object({
  cardName: z.string().min(2),
  cardNumber: z.string().min(16).max(19),
  expiry: z.string().min(5),
  cvv: z.string().min(3).max(4),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const router = useRouter();
  const selectedItem = useOrderStore((state) => state.selectedItem);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  if (!selectedItem) {
    return (
      <main className="min-h-screen px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800/70 bg-slate-900/70 p-10 text-center shadow-glow">
          <p className="text-slate-300">Your checkout session expired or no item is selected.</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-6 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Return to home
          </button>
        </div>
      </main>
    );
  }

  const onSubmit = (data: PaymentFormValues) => {
    clearOrder();
    router.push('/track-order');
  };

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
          <h1 className="text-4xl font-semibold text-slate-100">Secure Payment</h1>
          <p className="mt-3 text-slate-400">Enter payment details for {selectedItem.name}.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Cardholder Name
              <input
                {...register('cardName')}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                placeholder="Full name"
              />
              {errors.cardName && <p className="text-xs text-rose-400">{errors.cardName.message}</p>}
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Card Number
              <input
                {...register('cardNumber')}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && <p className="text-xs text-rose-400">{errors.cardNumber.message}</p>}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-300">
              Expiry
              <input
                {...register('expiry')}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                placeholder="MM/YY"
              />
              {errors.expiry && <p className="text-xs text-rose-400">{errors.expiry.message}</p>}
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              CVV
              <input
                {...register('cvv')}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                placeholder="123"
              />
              {errors.cvv && <p className="text-xs text-rose-400">{errors.cvv.message}</p>}
            </label>
          </div>

          <button type="submit" className="w-full rounded-3xl bg-sky-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Pay ₹{selectedItem.price}
          </button>
        </form>
      </div>
    </main>
  );
}
