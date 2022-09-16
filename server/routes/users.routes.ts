import { json } from "body-parser";
import { Request, Router } from "express"
import { logger } from "../handlers/errorLogger";
import ClientModel from "../models/ClientModel";

const router = Router()

router.get('/', async (req: Request<{}, {}, {}, {page?: number, limit?: number, status?: string}>, res) => {
    try {
        const { limit, page, status } = req.query
        let clients = await ClientModel.find()
        clients = clients
			.filter(({ claimedStatus }) => !!claimedStatus)
			.concat(clients.filter(({ claimedStatus }) => !claimedStatus))
        if ( status ) {
            clients = clients.filter(client => client.status === status)
        }
        const length = clients.length
        if ( limit && page ) {
            const end = Math.max(limit * (page + 1), clients.length)
            clients = clients.slice(page * limit, end)
        }
        return res.json({ clients, length })
    }
    catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.put("/:id", json(), async (req: Request<{id: string}, {}, {status: string}>, res) => {
	try {
        const { id } = req.params
        const { status } = req.body
        const statuses = ['common', 'agent', 'delegate']
        if ( !statuses.includes(status) ) {
            return res.status(500).json({ message: 'Неверное значение статуса пользователя' })
        }
        const client = await ClientModel.findById(id)
        if ( !client ) {
            return res
				.status(500)
				.json({ message: "Пользователь не найден" })
        }
        client.status = status
        await client.save()
        if (status === client.claimedStatus) {
            await ClientModel.findByIdAndUpdate(id, { $unset: { claimedStatus: true } })
		}
        return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router