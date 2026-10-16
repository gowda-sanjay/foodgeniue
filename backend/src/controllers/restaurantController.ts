import { Request, Response } from 'express';
import { fetchRestaurants, fetchRestaurantById, searchRestaurants, fetchNearbyRestaurants } from '../services/restaurantService';

export async function getRestaurantsController(req: Request, res: Response) {
  const restaurants = await fetchRestaurants(req.query);
  res.json(restaurants);
}

export async function getRestaurantByIdController(req: Request, res: Response) {
  const restaurant = await fetchRestaurantById(req.params.id);
  res.json(restaurant);
}

export async function searchRestaurantsController(req: Request, res: Response) {
  const restaurants = await searchRestaurants(req.query);
  res.json(restaurants);
}

export async function getNearbyRestaurantsController(req: Request, res: Response) {
  const restaurants = await fetchNearbyRestaurants(req.query);
  res.json(restaurants);
}
