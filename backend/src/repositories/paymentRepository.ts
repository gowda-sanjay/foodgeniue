import { getPrisma } from '../config/prisma';

export async function createPaymentRecord(data: any) {
  return getPrisma().payment.create({ data });
}

export async function updatePaymentRecord(orderId: string, data: any) {
  return getPrisma().payment.update({ where: { orderId }, data });
}
