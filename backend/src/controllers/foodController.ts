import { Request, Response } from 'express';
import { fetchFoods, fetchFoodById, searchFoods, fetchFoodsByCategory } from '../services/foodService';

export async function getFoodsController(req: Request, res: Response) {
  const foods = await fetchFoods(req.query);
  res.json(foods);
}

export async function getFoodByIdController(req: Request, res: Response) {
  const food = await fetchFoodById(req.params.id);
  res.json(food);
}

export async function searchFoodsController(req: Request, res: Response) {
  const foods = await searchFoods(req.query);
  res.json(foods);
}

export async function getFoodsByCategoryController(req: Request, res: Response) {
  const foods = await fetchFoodsByCategory(req.query);
  res.json(foods);
}
