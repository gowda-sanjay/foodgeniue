import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createReviewController, getReviewsController } from '../controllers/reviewController';
import { validateRequest } from '../middlewares/validateRequest';
import { createReviewSchema } from '../validators/reviewSchemas';

export const reviewRouter = Router();

reviewRouter.use(authMiddleware);
reviewRouter.post('/', validateRequest(createReviewSchema), createReviewController);
reviewRouter.get('/', getReviewsController);
