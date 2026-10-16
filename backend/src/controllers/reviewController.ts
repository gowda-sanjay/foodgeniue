import { Request, Response } from 'express';
import { createReview, getReviews } from '../services/reviewService';

export async function createReviewController(req: Request, res: Response) {
  const review = await createReview(req.user!.id, req.body);
  res.status(201).json(review);
}

export async function getReviewsController(req: Request, res: Response) {
  const reviews = await getReviews(req.query);
  res.json(reviews);
}
