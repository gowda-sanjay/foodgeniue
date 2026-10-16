import { createOrderRecord, listOrdersByUser, findOrderById, updateOrderRecord } from '../repositories/orderRepository';
import { getPrisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export async function createOrder(userId: string, data: any) {
  const prisma = getPrisma();
  const items = await Promise.all(
    data.items.map(async (item: any) => {
      const food = await prisma.food.findUnique({ where: { id: item.foodId } });
      if (!food) {
        throw new ApiError(404, `Food item ${item.foodId} not found`);
      }
      return {
        foodId: food.id,
        quantity: item.quantity,
        unitPrice: food.price,
        totalPrice: food.price * item.quantity
      };
    })
  );

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0) + (data.deliveryFee || 0) + (data.gst || 0);

  return createOrderRecord({
    userId,
    restaurantId: data.restaurantId,
    status: 'PENDING',
    paymentMethod: data.paymentMethod,
    paymentStatus: 'PENDING',
    deliveryAddress: data.deliveryAddress,
    phoneNumber: data.phoneNumber,
    specialInstructions: data.specialInstructions,
    deliveryFee: data.deliveryFee || 0,
    gst: data.gst || 0,
    totalAmount,
    items
  });
}

export async function getOrdersByUser(userId: string) {
  return listOrdersByUser(userId);
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await findOrderById(userId, orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return order;
}

export async function updateOrder(userId: string, orderId: string, data: any) {
  const order = await findOrderById(userId, orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return updateOrderRecord(orderId, data);
}
