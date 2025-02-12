export * from "./login.js"
import { z } from "zod"

export const userRegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  lastName: z.string(),
  firstName: z.string()
});

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
});


export const OrderSchema = z.object({
  userId: z.string().uuid(),
  shippingAddress: z.string().min(5).max(255),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ),
});

export const categorySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
});


export const paymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.enum(["credit_card", "paypal", "bank_transfer"]),
  transactionId: z.string().min(6),
  status: z.enum().optional(),
});


export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3),
});



export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  price: z.number().positive(),
  currency: z.enum(["USD", "EUR", "UZS", "RUB"]),
  stockQuantity: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
});

