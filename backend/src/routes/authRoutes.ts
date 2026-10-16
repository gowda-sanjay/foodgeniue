import { Router } from 'express';
import { registerController, loginController, logoutController, refreshController } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema, refreshSchema } from '../validators/authSchemas';

export const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), registerController);
authRouter.post('/login', validateRequest(loginSchema), loginController);
authRouter.post('/logout', logoutController);
authRouter.post('/refresh', validateRequest(refreshSchema), refreshController);
