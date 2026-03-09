import { z } from 'zod';

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    orgName: z.string().min(2),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const ProductCreateSchema = z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    description: z.string().optional(),
    quantityOnHand: z.number().int().nonnegative(),
    costPrice: z.number().optional(),
    sellingPrice: z.number().optional(),
    lowStockThreshold: z.number().int().optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const StockAdjustSchema = z.object({
    adjustment: z.number().int(),
    note: z.string().optional(),
});

export const OrgSettingsUpdateSchema = z.object({
    defaultLowStockThreshold: z.number().int().nonnegative(),
});
