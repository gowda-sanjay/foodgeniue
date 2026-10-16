'use client';

import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/orderStore';
import type { FoodItem } from '@/data/restaurants';

interface FoodCardProps {
  food: FoodItem;
}

export function FoodCard({ food }: FoodCardProps) {
  const setSelectedItem = useOrderStore((state) => state.setSelectedItem);
  const router = useRouter();

  const handleOrderNow = () => {
    setSelectedItem(food);
    router.push('/checkout');
  };

  return (
    <article className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-glow transition hover:-translate-y-1 hover:border-sky-500/60 hover:bg-slate-900/90">
      <div className="flex items-start gap-4">
        <img src={food.image} alt={food.name} className="h-28 w-28 rounded-3xl object-cover" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{food.name}</h3>
              <p className="text-sm text-slate-400">{food.category}</p>
            </div>
            <p className="text-lg font-semibold text-sky-300">₹{food.price}</p>
          </div>
          <p className="text-sm leading-6 text-slate-400">{food.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 px-3 py-1">{food.deliveryTime} mins</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">{food.veg ? 'Veg' : 'Non-Veg'}</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">{food.rating} ★</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleOrderNow}
        className="mt-5 w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        Order Now
      </button>
    </article>
  );
}
