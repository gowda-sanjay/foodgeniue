import { Request, Response } from 'express';
import { createOrder, getOrdersByUser, getOrderById, updateOrder } from '../services/orderService';

export async function createOrderController(req: Request, res: Response) {
  const order = await createOrder(req.user!.id, req.body);
  res.status(201).json(order);
}

export async function getOrdersController(req: Request, res: Response) {
  const orders = await getOrdersByUser(req.user!.id);
  res.json(orders);
}

export async function getOrderByIdController(req: Request, res: Response) {
  const order = await getOrderById(req.user!.id, req.params.id);
  res.json(order);
}

export async function updateOrderController(req: Request, res: Response) {
  const updated = await updateOrder(req.user!.id, req.params.id, req.body);
  res.json(updated);
}
