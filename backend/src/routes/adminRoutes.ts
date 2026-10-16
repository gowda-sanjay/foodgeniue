import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/adminMiddleware';
import { getAdminDashboardController } from '../controllers/adminController';

export const adminRouter = Router();

adminRouter.use(authMiddleware, requireAdmin);
adminRouter.get('/dashboard', getAdminDashboardController);
