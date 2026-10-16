import { getPrisma } from '../config/prisma';

export async function createOrderRecord(data: any) {
  return getPrisma().order.create({
    data: {
      userId: data.userId,
      restaurantId: data.restaurantId,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      deliveryAddress: data.deliveryAddress,
      phoneNumber: data.phoneNumber,
      specialInstructions: data.specialInstructions,
      deliveryFee: data.deliveryFee,
      gst: data.gst,
      totalAmount: data.totalAmount,
      items: {
        create: data.items.map((item: any) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      }
    },
    include: { items: true }
  });
}

export async function listOrdersByUser(userId: string) {
  return getPrisma().order.findMany({ where: { userId }, include: { items: true, restaurant: true, payment: true } });
}

export async function findOrderById(userId: string, orderId: string) {
  return getPrisma().order.findFirst({ where: { id: orderId, userId }, include: { items: true, restaurant: true, payment: true } });
}

export async function updateOrderRecord(orderId: string, data: any) {
  return getPrisma().order.update({ where: { id: orderId }, data });
}
