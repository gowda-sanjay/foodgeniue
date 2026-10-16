import { FOODS_DATA, RESTAURANTS_DATA } from '@/data/restaurants';
import { FoodCard } from '@/components/FoodCard';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return RESTAURANTS_DATA.map((restaurant) => ({
    restaurantId: restaurant.id,
  }));
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;
  const restaurant = RESTAURANTS_DATA.find((item) => item.id === restaurantId);

  if (!restaurant) {
    notFound();
  }

  const menuItems = FOODS_DATA.filter((food) => food.restaurantId === restaurantId);

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-800/70 bg-slate-900/60 shadow-glow">
          <div className="relative h-96">
            <img src={restaurant.coverImage} alt={restaurant.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{restaurant.cuisine}</p>
              <h1 className="text-4xl font-semibold">{restaurant.name}</h1>
              <p className="mt-3 max-w-2xl text-slate-200">{restaurant.description}</p>
            </div>
          </div>
          <div className="space-y-4 p-8 sm:p-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Rating</p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">{restaurant.rating}</p>
                <p className="text-sm text-slate-400">{restaurant.reviewsCount} reviews</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Delivery</p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">{restaurant.deliveryTime} mins</p>
                <p className="text-sm text-slate-400">{restaurant.distance} km away</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Specials</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {restaurant.offers.map((offer) => (
                    <li key={offer}>• {offer}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Menu</p>
              <h2 className="text-3xl font-semibold text-slate-100">Popular picks</h2>
            </div>
            <p className="text-sm text-slate-400">{menuItems.length} dishes available</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {menuItems.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
