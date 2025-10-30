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

export const userCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(5).max(20).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().min(5).max(20).optional().or(z.literal('').transform(() => undefined)),
  email: z.string().email().optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const productCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(1),
  images: z.array(z.string().url().or(z.string().min(1))).default([]),
  price: z.number().nonnegative(),
  currency: z.string().min(1).default('USD'),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.partial();
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = categoryCreateSchema.partial();
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

