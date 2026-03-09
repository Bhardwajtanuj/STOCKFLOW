import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public errorCode: string = 'INTERNAL_ERROR'
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.errorCode || 'INTERNAL_ERROR';
    const message = err.message || 'An unexpected error occurred';

    // Structured logging with context
    logger.error({
        err,
        request: {
            method: req.method,
            url: req.url,
            userId: (req as any).user?.userId,
            organizationId: (req as any).user?.organizationId,
        }
    }, `[${errorCode}] ${message}`);

    res.status(statusCode).json({
        success: false,
        error: errorCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
