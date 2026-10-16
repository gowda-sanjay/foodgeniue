import { getPrisma } from '../config/prisma';

export async function listFoods(query: any) {
  return getPrisma().food.findMany({
    where: {
      foodName: { contains: query.q as string },
      OR: [
        { description: { contains: query.q as string } },
        { category: { name: { contains: query.category as string } } }
      ]
    }
  });
}

export async function findFoodById(id: string) {
  return getPrisma().food.findUnique({ where: { id }, include: { nutrition: true, restaurant: true } });
}

export async function findFoodsByCategory(category?: string) {
  return getPrisma().food.findMany({ where: { category: category ? { name: category } : undefined } });
}
