import { Router } from 'express';
import { getFoodsController, getFoodByIdController, searchFoodsController, getFoodsByCategoryController } from '../controllers/foodController';

export const foodRouter = Router();

foodRouter.get('/', getFoodsController);
foodRouter.get('/search', searchFoodsController);
foodRouter.get('/category', getFoodsByCategoryController);
foodRouter.get('/:id', getFoodByIdController);
