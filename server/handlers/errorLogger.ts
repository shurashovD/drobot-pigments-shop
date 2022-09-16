import { Request, Response } from "express"
import * as log4js from 'log4js'

const level = process.env.NODE_ENV === 'production' ? 'error' : 'debug'

const errorHandler = (err: Error, req: Request, res: Response) => {
    console.error(err)
    const message = err.userError ? err.message || 'Что-то пошло не так...' : 'Что-то пошло не так...'
    return res.status(500).json({ message })
}

log4js.configure({
	appenders: {
		out: { type: "stdout" },
		app: { type: "file", filename: "application.log" },
	},
	categories: {
		default: { appenders: ["out", "app"], level, enableCallStack: true },
	},
})

export const logger = log4js.getLogger()

export default errorHandler