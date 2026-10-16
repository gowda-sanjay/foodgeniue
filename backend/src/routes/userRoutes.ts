import { Router } from 'express';
import { getProfileController, updateProfileController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { updateProfileSchema } from '../validators/userSchemas';

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get('/profile', getProfileController);
userRouter.put('/profile', validateRequest(updateProfileSchema), updateProfileController);
