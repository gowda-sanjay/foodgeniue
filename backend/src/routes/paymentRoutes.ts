import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createPaymentController, verifyPaymentController } from '../controllers/paymentController';
import { validateRequest } from '../middlewares/validateRequest';
import { createPaymentSchema, verifyPaymentSchema } from '../validators/paymentSchemas';

export const paymentRouter = Router();

paymentRouter.use(authMiddleware);
paymentRouter.post('/create', validateRequest(createPaymentSchema), createPaymentController);
paymentRouter.post('/verify', validateRequest(verifyPaymentSchema), verifyPaymentController);
