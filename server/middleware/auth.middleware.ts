import { NextFunction, Request, Response } from 'express';
import { logger } from '../handlers/errorLogger';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if ( req.session.userId ) {
            return next()
        }
        return res.status(500).json({ message: "Пользователь не авторизован" })
    }
    catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Ошибка авторизации' }) 
    }
}

export default authMiddleware