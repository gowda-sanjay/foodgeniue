import { RestaurantCard } from '@/components/RestaurantCard';
import { RESTAURANTS_DATA } from '@/data/restaurants';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow backdrop-blur-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">KGF Food Finder</p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
                Discover the best local restaurants and order directly.
              </h1>
              <p className="max-w-xl text-slate-400">
                FoodGenie AI helps you explore KGF’s real restaurants using the uploaded dataset. No fake venues, no cart clutter — just fast order now checkout flow.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6 shadow-xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Open now</p>
              <p className="mt-4 text-3xl font-semibold text-slate-100">KGF Favorites</p>
              <p className="mt-3 text-slate-400">Browse authentic local restaurants with rich menu details and direct order checkout.</p>
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {RESTAURANTS_DATA.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </section>
      </section>
    </main>
  );
}
