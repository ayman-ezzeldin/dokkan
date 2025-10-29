import { z } from 'zod';

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    title: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  shipping: z.number().nonnegative().default(0),
});

export type OrderInput = z.infer<typeof orderSchema>;

