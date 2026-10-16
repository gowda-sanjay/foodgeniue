import { createPaymentRecord, updatePaymentRecord } from '../repositories/paymentRepository';
import { ApiError } from '../utils/apiError';

export async function createPayment(userId: string, data: any) {
  const payment = await createPaymentRecord({
    orderId: data.orderId,
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId,
    amount: data.amount,
    status: 'PENDING'
  });
  return payment;
}

export async function verifyPayment(userId: string, data: any) {
  if (data.status !== 'SUCCESS' && data.status !== 'FAILED') {
    throw new ApiError(400, 'Invalid payment status');
  }

  const payment = await updatePaymentRecord(data.orderId, {
    status: data.status,
    transactionId: data.transactionId
  });
  return payment;
}
