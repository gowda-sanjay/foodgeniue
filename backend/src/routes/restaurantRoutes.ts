import { Router } from 'express';
import { getRestaurantsController, getRestaurantByIdController, searchRestaurantsController, getNearbyRestaurantsController } from '../controllers/restaurantController';

export const restaurantRouter = Router();

restaurantRouter.get('/', getRestaurantsController);
restaurantRouter.get('/search', searchRestaurantsController);
restaurantRouter.get('/nearby', getNearbyRestaurantsController);
restaurantRouter.get('/:id', getRestaurantByIdController);
