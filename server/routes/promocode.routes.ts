import { json } from "body-parser";
import { Request, Router } from "express";
import { logger } from "../handlers/errorLogger";
import ClientModel from '../models/ClientModel'
import PromocodeModel from "../models/PromocodeModel";

const router = Router()

router.get('/:id', async (req: Request<{id: string}>, res) => {
    try {
        const { id } = req.params
        const promocode = await PromocodeModel.getPromocode(id)
        if ( !promocode ) {
            return res.status(404).json({ message: 'Промокод не найден' })
        }
        return res.json(promocode)
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get("/by-user/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const { id } = req.params
		const client = await ClientModel.findById(id)
		if (!client) {
			return res.status(404).json({ message: "Клиент не найден" })
		}
		const promocodes = await client.getPromocodes()
		return res.json(promocodes)
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post("/", json(), async (req: Request<{}, {}, { code: string, dateStart: string, dateFinish: string, holderId: string }>, res) => {
	try {
		const { code, dateFinish, dateStart, holderId } = req.body
		const holder = await ClientModel.findById(holderId)
        if ( !holder ) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }
        await holder.createPromocode(code, dateFinish, dateStart)
        return res.end()
		
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

router.put("/:id", json(), async (req: Request<{ id: string }, {}, { code: string; dateStart: string; dateFinish: string }>, res) => {
	try {
		const { id } = req.params
		const promocode = await PromocodeModel.findById(id)
		if (!promocode) {
			return res.status(404).json({ message: "Промокод не найден" })
		}
		
        const { code, dateFinish, dateStart } = req.body
        const cursor = await PromocodeModel.findOne({ _id: { $ne: promocode._id }, code })
        if ( cursor ) {
            return res.status(404).json({ message: "Такой промокод уже существует" })
        }
        await PromocodeModel.findByIdAndUpdate(id, { code, dateFinish, dateStart })
        return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params
		const promocode = await PromocodeModel.findById(id)
		if (!promocode) {
			return res.status(404).json({ message: "Промокод не найден" })
		}

        if ( promocode.status !== 'created' ) {
            return res.status(500).json({ message: 'Нельзя удалить этот промокод' })
        }
		await PromocodeModel.findByIdAndDelete(id)
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router