import { listRestaurants, findRestaurantById, findRestaurants, findNearbyRestaurants } from '../repositories/restaurantRepository';
import { ApiError } from '../utils/apiError';

export async function fetchRestaurants(query: any) {
  return listRestaurants();
}

export async function fetchRestaurantById(id: string) {
  const restaurant = await findRestaurantById(id);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  return restaurant;
}

export async function searchRestaurants(query: any) {
  return findRestaurants(query);
}

export async function fetchNearbyRestaurants(query: any) {
  const latitude = query.latitude ? Number(query.latitude) : undefined;
  const longitude = query.longitude ? Number(query.longitude) : undefined;
  return findNearbyRestaurants(latitude, longitude);
}
