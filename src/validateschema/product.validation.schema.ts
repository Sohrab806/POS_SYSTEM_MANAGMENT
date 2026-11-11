import { z } from "zod";

export const productSchema = z.object({

  product_name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  product_details: z
    .string()
    .trim()
    .max(1000, "Details cannot exceed 1000 characters")
    .optional(),

  sku: z
    .string()
    .trim()
    .max(50, "SKU cannot exceed 50 characters")
    .optional(),

  barcode: z
    .string()
    .trim()
    .max(100, "Barcode cannot exceed 100 characters")
    .optional(),

  product_price: z
    .number()
    .nonnegative("Product price cannot be negative")
    .finite(),

  selling_price: z
    .number()
    .positive("Selling price must be greater than zero")
    .finite(),

  stock_quantity: z
    .number()
    .int("Stock quantity must be an integer")
    .nonnegative("Stock cannot be negative")
    .default(0),

  low_stock_threshold: z
    .number()
    .int("Low stock threshold must be an integer")
    .nonnegative()
    .default(5),

  image_url: z
    .string()
    .url("Invalid image URL")
    .startsWith("https://")
    .optional()
    .or(z.literal("")),

});

export type ProductBody = z.infer<typeof productSchema>;