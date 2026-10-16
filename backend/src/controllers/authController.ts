import { Request, Response } from 'express';
import { registerUser, authenticateUser, logoutUser, refreshTokens } from '../services/authService';

export async function registerController(req: Request, res: Response) {
  const result = await registerUser(req.body);
  res.status(201).json(result);
}

export async function loginController(req: Request, res: Response) {
  const result = await authenticateUser(req.body);
  res.json(result);
}

export async function logoutController(req: Request, res: Response) {
  await logoutUser(req.cookies.refreshToken || req.body.refreshToken);
  res.json({ success: true });
}

export async function refreshController(req: Request, res: Response) {
  const result = await refreshTokens(req.body.refreshToken);
  res.json(result);
}
