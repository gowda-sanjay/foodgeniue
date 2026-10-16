import { listFoods, findFoodById, findFoodsByCategory } from '../repositories/foodRepository';
import { ApiError } from '../utils/apiError';

export async function fetchFoods(query: any) {
  return listFoods(query);
}

export async function fetchFoodById(id: string) {
  const food = await findFoodById(id);
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }
  return food;
}

export async function searchFoods(query: any) {
  return listFoods(query);
}

export async function fetchFoodsByCategory(query: any) {
  return findFoodsByCategory(query.category as string | undefined);
}
