import { Request, Response } from 'express';
import { chatAi, searchAi, imageAi, voiceAi, recommendAi } from '../services/aiService';

export async function chatAiController(req: Request, res: Response) {
  const response = await chatAi(req.user!.id, req.body);
  res.json(response);
}

export async function searchAiController(req: Request, res: Response) {
  const response = await searchAi(req.user!.id, req.body);
  res.json(response);
}

export async function imageAiController(req: Request, res: Response) {
  const response = await imageAi(req.user!.id, req.body);
  res.json(response);
}

export async function voiceAiController(req: Request, res: Response) {
  const response = await voiceAi(req.user!.id, req.body);
  res.json(response);
}

export async function recommendAiController(req: Request, res: Response) {
  const response = await recommendAi(req.user!.id, req.body);
  res.json(response);
}
