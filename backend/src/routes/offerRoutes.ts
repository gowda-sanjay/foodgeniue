import { Router } from 'express';
import { getOffersController } from '../controllers/offerController';

export const offerRouter = Router();

offerRouter.get('/', getOffersController);
