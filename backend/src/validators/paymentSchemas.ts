import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    paymentMethod: z.enum(['COD', 'ONLINE', 'UPI']),
    amount: z.number().nonnegative()
  })
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    transactionId: z.string().optional(),
    status: z.enum(['PENDING', 'SUCCESS', 'FAILED'])
  })
});
