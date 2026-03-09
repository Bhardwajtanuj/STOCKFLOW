import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export class DashboardController {
    static async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
        const organizationId = req.user?.organizationId;

        try {
            const [totalProducts, unitsResult, settings] = await Promise.all([
                prisma.product.count({ where: { organizationId } }),
                prisma.product.aggregate({
                    where: { organizationId },
                    _sum: { quantityOnHand: true }
                }),
                prisma.orgSettings.findUnique({
                    where: { organizationId }
                })
            ]);

            const defaultThreshold = settings?.defaultLowStockThreshold ?? 5;

            // Find low stock items
            const products = await prisma.product.findMany({
                where: { organizationId }
            });

            const lowStockItems = products.filter(p => {
                const threshold = p.lowStockThreshold ?? defaultThreshold;
                return p.quantityOnHand <= threshold;
            });

            res.json({
                totalProducts,
                totalUnits: unitsResult._sum.quantityOnHand || 0,
                lowStockItems,
                lowStockCount: lowStockItems.length
            });
        } catch (error) {
            next(error);
        }
    }
}
