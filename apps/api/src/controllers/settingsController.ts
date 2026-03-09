import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { OrgSettingsUpdateSchema } from '@stockflow/shared';
import { AuthRequest } from '../middleware/auth';

export class SettingsController {
    static async get(req: AuthRequest, res: Response, next: NextFunction) {
        const organizationId = req.user?.organizationId;

        try {
            const settings = await prisma.orgSettings.findUnique({
                where: { organizationId }
            });

            if (!settings) return res.status(404).json({ error: 'NOT_FOUND' });
            res.json(settings);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        const validation = OrgSettingsUpdateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', details: validation.error.format() });
        }

        const organizationId = req.user?.organizationId;

        try {
            const updated = await prisma.orgSettings.update({
                where: { organizationId },
                data: validation.data
            });

            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
}
