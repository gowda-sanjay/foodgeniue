import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    restaurantId: z.string().min(1),
    deliveryAddress: z.string().min(5),
    phoneNumber: z.string().min(10),
    items: z.array(z.object({
      foodId: z.string().min(1),
      quantity: z.number().min(1)
    })),
    paymentMethod: z.enum(['COD', 'ONLINE', 'UPI']),
    specialInstructions: z.string().optional(),
    deliveryFee: z.number().nonnegative().optional(),
    gst: z.number().nonnegative().optional()
  })
});

export const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']).optional(),
    paymentStatus: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional()
  })
});
