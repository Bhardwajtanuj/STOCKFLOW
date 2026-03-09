import { z } from 'zod';
import {
    SignupSchema,
    LoginSchema,
    ProductCreateSchema,
    ProductUpdateSchema,
    StockAdjustSchema,
    OrgSettingsUpdateSchema,
} from '../schemas';

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
export type StockAdjustInput = z.infer<typeof StockAdjustSchema>;
export type OrgSettingsUpdateInput = z.infer<typeof OrgSettingsUpdateSchema>;
