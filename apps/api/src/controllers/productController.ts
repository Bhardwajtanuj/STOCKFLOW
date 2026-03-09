import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ProductCreateSchema, ProductUpdateSchema, StockAdjustSchema } from '@stockflow/shared';
import { AuthRequest } from '../middleware/auth';
import { ProductService } from '../services/productService';

export class ProductController {
    static async list(req: AuthRequest, res: Response, next: NextFunction) {
        const { search, page = '1', limit = '10' } = req.query;
        const organizationId = req.user?.organizationId;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        try {
            const filters = {
                organizationId,
                ...(search && {
                    OR: [
                        { name: { contains: search as string, mode: 'insensitive' as const } },
                        { sku: { contains: search as string, mode: 'insensitive' as const } }
                    ]
                })
            };

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where: filters,
                    skip,
                    take,
                    orderBy: { updatedAt: 'desc' }
                }),
                prisma.product.count({ where: filters })
            ]);

            res.json({ products, total, page: parseInt(page as string) });
        } catch (error) {
            next(error);
        }
    }

    static async get(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const product = await prisma.product.findFirst({
                where: { id: req.params.id, organizationId: req.user?.organizationId }
            });

            if (!product) return res.status(404).json({ error: 'NOT_FOUND' });
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        const validation = ProductCreateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', details: validation.error.format() });
        }

        const organizationId = req.user?.organizationId as string;

        try {
            const existing = await prisma.product.findUnique({
                where: { organizationId_sku: { organizationId, sku: validation.data.sku } }
            });

            if (existing) {
                return res.status(409).json({ error: 'CONFLICT', message: 'SKU already exists' });
            }

            const product = await prisma.product.create({
                data: {
                    ...validation.data,
                    organizationId,
                    costPrice: validation.data.costPrice ? Number(validation.data.costPrice) : null,
                    sellingPrice: validation.data.sellingPrice ? Number(validation.data.sellingPrice) : null,
                }
            });

            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        const validation = ProductUpdateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', details: validation.error.format() });
        }

        const organizationId = req.user?.organizationId;

        try {
            const product = await prisma.product.findFirst({
                where: { id: req.params.id, organizationId }
            });

            if (!product) return res.status(404).json({ error: 'NOT_FOUND' });

            const updated = await prisma.product.update({
                where: { id: req.params.id },
                data: {
                    ...validation.data,
                    costPrice: validation.data.costPrice !== undefined ? Number(validation.data.costPrice) : product.costPrice,
                    sellingPrice: validation.data.sellingPrice !== undefined ? Number(validation.data.sellingPrice) : product.sellingPrice,
                }
            });

            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await prisma.product.deleteMany({
                where: { id: req.params.id, organizationId: req.user?.organizationId }
            });

            if (result.count === 0) return res.status(404).json({ error: 'NOT_FOUND' });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async adjustStock(req: AuthRequest, res: Response, next: NextFunction) {
        const validation = StockAdjustSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', details: validation.error.format() });
        }

        const { adjustment, note } = validation.data;
        const organizationId = req.user?.organizationId as string;

        try {
            const product = await ProductService.adjustStock({
                productId: req.params.id,
                organizationId,
                adjustment,
                note
            });

            res.json(product);
        } catch (error: any) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
            if (error.message === 'INSUFFICIENT_STOCK') return res.status(400).json({ error: 'INSUFFICIENT_STOCK', message: 'Negative stock levels not allowed' });
            next(error);
        }
    }

    static async getMovements(req: AuthRequest, res: Response, next: NextFunction) {
        const organizationId = req.user?.organizationId as string;
        try {
            const movements = await ProductService.getMovements(req.params.id, organizationId);
            res.json(movements);
        } catch (error) {
            next(error);
        }
    }
}
