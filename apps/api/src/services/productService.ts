import { prisma } from '../lib/prisma';

export class ProductService {
    /**
     * Adjusts stock level and records the movement in a single transaction.
     */
    static async adjustStock({
        productId,
        organizationId,
        adjustment,
        note,
    }: {
        productId: string;
        organizationId: string;
        adjustment: number;
        note?: string;
    }) {
        return await prisma.$transaction(async (tx) => {
            const product = await tx.product.findFirst({
                where: { id: productId, organizationId },
            });

            if (!product) {
                throw new Error('NOT_FOUND');
            }

            const newQuantity = product.quantityOnHand + adjustment;
            if (newQuantity < 0) {
                throw new Error('INSUFFICIENT_STOCK');
            }

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { quantityOnHand: newQuantity },
            });

            await tx.inventoryMovement.create({
                data: {
                    productId,
                    organizationId,
                    change: adjustment,
                    note,
                },
            });

            return updatedProduct;
        });
    }

    /**
     * Retrieves the movement history for a specific product.
     */
    static async getMovements(productId: string, organizationId: string) {
        return await prisma.inventoryMovement.findMany({
            where: { productId, organizationId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
