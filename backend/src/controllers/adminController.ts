import { Request, Response } from 'express';
import { getAdminDashboardStats } from '../services/adminService';

export async function getAdminDashboardController(req: Request, res: Response) {
  const stats = await getAdminDashboardStats();
  res.json(stats);
}
