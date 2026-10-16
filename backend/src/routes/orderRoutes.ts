import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createOrderController, getOrdersController, getOrderByIdController, updateOrderController } from '../controllers/orderController';
import { validateRequest } from '../middlewares/validateRequest';
import { createOrderSchema, updateOrderSchema } from '../validators/orderSchemas';

export const orderRouter = Router();

orderRouter.use(authMiddleware);
orderRouter.post('/', validateRequest(createOrderSchema), createOrderController);
orderRouter.get('/', getOrdersController);
orderRouter.get('/:id', getOrderByIdController);
orderRouter.patch('/:id', validateRequest(updateOrderSchema), updateOrderController);
