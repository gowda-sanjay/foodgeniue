import { Request, Response } from 'express';
import { getUserProfile, updateUserProfile } from '../services/userService';

export async function getProfileController(req: Request, res: Response) {
  const user = await getUserProfile(req.user!.id);
  res.json(user);
}

export async function updateProfileController(req: Request, res: Response) {
  const user = await updateUserProfile(req.user!.id, req.body);
  res.json(user);
}
