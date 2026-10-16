import { Request, Response } from 'express';
import { fetchOffers } from '../services/offerService';

export async function getOffersController(req: Request, res: Response) {
  const offers = await fetchOffers();
  res.json(offers);
}
