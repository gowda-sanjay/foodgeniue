'use client';

import { useMemo, useState } from 'react';
import { RestaurantCard } from '@/components/RestaurantCard';
import { RESTAURANTS_DATA } from '@/data/restaurants';

export default function RestaurantsPage() {
  const [query, setQuery] = useState('');

  const filteredRestaurants = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return RESTAURANTS_DATA;

    return RESTAURANTS_DATA.filter((restaurant) => {
      const searchable = [
        restaurant.name,
        restaurant.cuisine,
        restaurant.description,
        restaurant.address,
        restaurant.googleMaps,
        restaurant.offers.join(' '),
        restaurant.popularFoods.join(' ')
      ].join(' ').toLowerCase();
      return searchable.includes(normalized);
    });
  }, [query]);

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-glow backdrop-blur-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">All KGF Restaurants</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
              Explore authentic KGF dining spots backed by your dataset.
            </h1>
            <p className="max-w-2xl text-slate-400">
              Browse verified restaurants and tap into the direct order flow. No fake listings — just the uploaded KGF dataset.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6 shadow-inner">
            <label htmlFor="restaurant-search" className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Search Restaurants
            </label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="restaurant-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, cuisine, food, address or offers"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
              />
              <span className="rounded-3xl bg-slate-900/95 px-5 py-4 text-sm font-medium text-slate-300">
                {filteredRestaurants.length} result{filteredRestaurants.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </section>

        {filteredRestaurants.length === 0 && (
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-10 text-center text-slate-300 shadow-glow">
            <p className="text-lg font-medium">No restaurants matched your search.</p>
            <p className="mt-2 text-sm text-slate-500">Try searching by restaurant name, cuisine, popular food, or location.</p>
          </div>
        )}
      </section>
    </main>
  );
}
