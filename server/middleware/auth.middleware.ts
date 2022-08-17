import { NextFunction, Request, Response } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if ( req.session.userId ) {
            return next()
        }
        return res.status(500).json({ message: "Пользователь не авторизован" })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Ошибка авторизации' }) 
    }
}

export default authMiddleware