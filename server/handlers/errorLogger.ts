import { NextFunction, Request, Response } from "express"

const production = process.env.NODE_ENV === 'production'

const errorHandler = (err: Error, req: Request, res: Response) => {
    console.error(err)
    const message = err.userError ? err.message || 'Что-то пошло не так...' : 'Что-то пошло не так...'
    return res.status(500).json({ message })
}

export default errorHandler