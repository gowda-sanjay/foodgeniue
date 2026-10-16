import { getPrisma } from '../config/prisma';

export async function findRestaurants(query: any) {
  return getPrisma().restaurant.findMany({
    where: {
      restaurantName: { contains: query.q as string },
      OR: [
        { description: { contains: query.q as string } }
      ]
    },
    include: { offers: true }
  });
}

export async function findRestaurantById(id: string) {
  return getPrisma().restaurant.findUnique({ where: { id }, include: { foods: true, offers: true, reviews: true } });
}

export async function findNearbyRestaurants(latitude?: number, longitude?: number) {
  return getPrisma().restaurant.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' }
  });
}

export async function listRestaurants() {
  return getPrisma().restaurant.findMany({ include: { offers: true, reviews: true } });
}
