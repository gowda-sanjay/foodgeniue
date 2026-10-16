import { Request, Response } from 'express';
import { createPayment, verifyPayment } from '../services/paymentService';

export async function createPaymentController(req: Request, res: Response) {
  const payment = await createPayment(req.user!.id, req.body);
  res.status(201).json(payment);
}

export async function verifyPaymentController(req: Request, res: Response) {
  const payment = await verifyPayment(req.user!.id, req.body);
  res.json(payment);
}
