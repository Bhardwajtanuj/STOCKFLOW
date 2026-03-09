import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { SignupSchema, LoginSchema } from '@stockflow/shared';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class AuthController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        const validation = SignupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', details: validation.error.format() });
        }

        const { email, password, orgName } = validation.data;
        const slug = orgName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'USER_EXISTS', message: 'Account already exists with this email' });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const result = await prisma.$transaction(async (tx) => {
                const org = await tx.organization.create({
                    data: {
                        name: orgName,
                        slug,
                        settings: {
                            create: {
                                defaultLowStockThreshold: 5,
                            },
                        },
                    },
                });

                const user = await tx.user.create({
                    data: {
                        email,
                        passwordHash,
                        organizationId: org.id,
                    },
                });

                return { user, org };
            });

            const token = jwt.sign(
                { userId: result.user.id, organizationId: result.org.id, email: result.user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                token,
                user: { id: result.user.id, email: result.user.email },
                organization: result.org
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        const validation = LoginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', details: validation.error.format() });
        }

        const { email, password } = validation.data;

        try {
            const user = await prisma.user.findUnique({
                where: { email },
                include: { organization: true },
            });

            if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.id, organizationId: user.organizationId, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: { id: user.id, email: user.email },
                organization: user.organization
            });
        } catch (error) {
            next(error);
        }
    }

    static async me(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.userId },
                include: { organization: true },
            });

            if (!user) return res.status(404).json({ error: 'NOT_FOUND' });

            res.json({
                user: { id: user.id, email: user.email },
                organization: user.organization
            });
        } catch (error) {
            next(error);
        }
    }
}
