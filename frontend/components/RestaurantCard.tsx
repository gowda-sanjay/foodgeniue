import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import type { Restaurant } from '@/data/restaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/70 transition hover:-translate-y-1 hover:border-sky-500/60 hover:bg-slate-900/90">
      <div className="relative h-72 overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">{restaurant.cuisine}</p>
          <h2 className="text-xl font-semibold text-white">{restaurant.name}</h2>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <p className="text-sm text-slate-400 line-clamp-2">{restaurant.description}</p>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-sky-400" />
            {restaurant.distance} km
          </span>
          <span className="inline-flex items-center gap-1 text-amber-300">
            <Star className="h-4 w-4" />
            {restaurant.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
