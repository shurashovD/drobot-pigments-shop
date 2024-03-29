import { sdekGetOrderInfo } from './../sdekAPI/orders';
import { json } from "body-parser"
import { Request, Router } from "express"
import { IClient, INearestOrder } from "../../shared"
import { createContact, createTask, updateContact } from "../amoAPI/amoApi"
import ClientModel from '../models/ClientModel'
import PromocodeModel from '../models/PromocodeModel'
import { createMsCounterParty, editMsCounterParty } from "../moyskladAPI/counterparty"
import errorHandler, { logger } from '../handlers/errorLogger';

const router = Router()

router.put('/edit', json(), async (req: Request<{}, {}, {name: string, email: string}>, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
        if ( !client ) {
            const err = new Error('Пользователь не найден')
            err.userError = true
            throw err
        }

        const { name, email } = req.body
        const phone = client.tel

        client.name = name
		client.mail = email
        if (client.counterpartyId) {
            const payload: Parameters<typeof editMsCounterParty>[1] = { email, name, phone }
            await editMsCounterParty(client.counterpartyId, payload)
        } else {
            const counterparty = await createMsCounterParty({ name, email, phone })
            if ( counterparty ) {
                client.counterpartyId = counterparty.id
                client.name = name
				client.mail = email
                await client.save()
            } else {
                const err = new Error('Что-то пошло не так...')
                err.sersviceInfo = 'Ошибка создание контрагента в МС'
                throw err
            }
        }

        if ( client.amoContactId ) {
            try {
                await updateContact(client.amoContactId.toString(), name, phone, email)
            } catch (e) {
                console.log(e)
            }
        } else {
            const {id} = await createContact(name, phone, email)
            if ( id ) {
                client.amoContactId = id
            } else {
                const err = new Error("Что-то пошло не так...")
				err.sersviceInfo = "Ошибка создание контакта в АМО"
				throw err
            }
        }

        if (!client.status) {
			client.status = "common"
		}

        await client.save()
        return res.end()
    }
    catch (e: any) {
        logger.error(e)
        errorHandler(e, req, res)
    }
})

router.get("/order/nearest", async (req, res) => {
    const formatter = Intl.DateTimeFormat('ru', {
        day: '2-digit', month: '2-digit', year: '2-digit'
    })
	try {
        const client = await ClientModel.findById(req.session.userId)
        if ( !client ) {
            const err = new Error()
            err.userError = true
            err.sersviceInfo = `Получение заказа с ближайшей доставкой в ЛК. Пользователь ${req.session.userId} не найден`
            throw err
        }

		const order = await client.getNearestOrder()
        if ( order ) {
            const response: INearestOrder = {
                id: order.id,
                date: formatter.format(Date.parse(order.date)),
                number: order.number.toString(),
                products: order.products.map(({ product }) => (product)),
                variants: order.variants.map(({ product, variant }) => ({ product, variantId: variant.toString() }))
            }
            try {
                const entity = await sdekGetOrderInfo(order.id)
                const date = entity?.delivery_detail?.date
                if ( date ) {
                    const days = Math.max(Math.floor((Date.parse(date) - performance.now()) / (24 * 3600 * 1000)), 0)
                    let label = (parseInt((days-1).toString()[(days-1).toString().length - 1]) > 3) ? 'дней' : 'дня'
                    if ( days.toString()[days.toString().length - 1] === '1' ) label = 'день'
                    const delivery = days === 0 ? 'Сегодня' : `${days} ${label}`
                    response.delivery = delivery
                }
                 
            } catch (e: any) {
                e.sersviceInfo += ` Получение заказа с ближайшей доставкой в ЛК. Пользователь ${req.session.userId}.`
            }
            return res.json(response)
        } else {
            return res.end()
        }
	} catch (e: any) {
        logger.error(e)
        return res.end()
	}
})

router.get('/order/:id', async (req: Request<{id: string}>, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
        if ( !client ) {
            const err = new Error()
            err.userError = true
            err.sersviceInfo = `Получение заказа в ЛК. Пользователь ${req.session.userId} не найден`
            throw err
        }

        const { id } = req.params
        const order = await client.getOrder(id)
        return res.json(order) 
    }
    catch (e: any) {
        logger.error(e)
        errorHandler(e, req, res)
    }
})

router.get("/order/sdek-info/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = `Получение заказа в ЛК. Пользователь ${req.session.userId} не найден`
			throw err
		}

		const { id } = req.params
		const order = await client.getOrder(id)

        if (!order.delivery.sdek?.uuid) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = `Получение СДЭК информации заказа в ЛК. В заказе ${id} не найден uuid`
			throw err
		}

        const info = await sdekGetOrderInfo(order.delivery.sdek.uuid)
        return res.json(info)
        
	} catch (e: any) {
        logger.error(e)
		errorHandler(e, req, res)
	}
})

router.get('/discount', async (req, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = `Получение персональной скидки в ЛК. Пользователь ${req.session.userId} не найден`
			throw err
		}

        const discount = await client.getDiscount()
        return res.json(discount)
	} catch (e: any) {
        logger.error(e)
        return res.end()
	}
})

router.get("/promocode", async (req, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			return res.json([])
		}

        const promocodes = await PromocodeModel.find({ _id: { $in: client.promocodes } })
        return res.json(promocodes)
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Ошибка получения промокода" })
	}
})

router.get("/promocode/orders/:id", async (req: Request<{id: string}>, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			return res.json([])
		}

        const { id } = req.params
        const promocode = await PromocodeModel.findById(id)
        if ( !promocode ) {
            return res.json({ message: "Промокод не найден" })
        }
        if ( promocode.holderClient.toString() !== client._id.toString() ) {
            return res.json({ message: "Промокод не принадлежит пользователю" })
        }

        const details = await promocode.getDetails()
        return res.json(details)
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Ошибка получения промокода" })
	}
})

router.post("/promocode", json(), async (req: Request<{}, {}, { dateStart: string, dateFinish: string, code: string }>, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			return res.status(500).json({ message: 'Ошибка. Промокод не создан...' })
		}

        const { code, dateFinish, dateStart } = req.body
        await client.createPromocode(code, dateFinish, dateStart)
        return res.end()

	} catch (e: any) {
		logger.error(e)
        if ( e.userError ) {
            return res.status(500).json({ message: e.message })
        }
		return res.status(500).json({ message: "Ошибка. Промокод не создан..." })
	}
})

router.post("/cashe-output", json(), async (req: Request<{}, {}, { casheSize: number }>, res) => {
    try {
        function cashbackNotAvailable (client: IClient): boolean {
            const statuses = ['agent', 'delegate', 'coach']
            return statuses.includes(client?.status || '')
        }
        
        const { casheSize } = req.body
        const client = await ClientModel.findById(req.session.userId)
        if ( !client ) {
            return res.end()
        }
        if ( !cashbackNotAvailable(client) ) {
            return res.status(500).json({ message: "Кэшбэк не доступен" })
        }

        if (!client.cashBack || (client.cashBack < casheSize)) {
			return res.status(500).json({ message: `Доступно к списанию ${client.cashBack || 0} руб.` })
		}

        const text = `Покупатель ${client.name} хочет вывести кэшбэк в размере ${casheSize}`
        await createTask(text, client.amoContactId)
        return res.end()
    } catch (e) {
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.put("/promocode/:id", json(), async (req: Request<{id: string}, {}, { dateStart: string; dateFinish: string; code: string }>, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			return res.status(500).json({ message: "Ошибка. Промокод не обновлен..." })
		}

        await client.refreshPromocodes()

        const { code, dateFinish, dateStart } = req.body
        if ( new Date(Date.parse(dateFinish)) < new Date(Date.now()) ) {
            return res.status(500).json({ message: "Неверная дата окончания промокода" })
		}

        const { id } = req.params
        const promocode = await PromocodeModel.findById(id)
        if ( !promocode ) {
            throw new Error(`Промокод ${id} не найден`)
        }
		
        if (promocode.status === 'running') {
			return res.status(500).json({ message: 'Нельзя изменить действующий промокод' })
		}

        if (promocode.status === "stopped") {
			return res.status(500).json({ message: "Нельзя изменить остановленный промокод" })
		}

        if (promocode.status === "finished") {
			return res.status(500).json({ message: "Нельзя изменить завершенный промокод" })
		}

        const cursor = await PromocodeModel.findOne({ code, _id: { $ne: id } })
		if (cursor) {
			const error = new Error("Такой промокод уже есть")
			error.userError = true
			throw error
		}

        promocode.code = code
        promocode.dateStart = new Date(Date.parse(dateStart))
        promocode.dateFinish = new Date(Date.parse(dateFinish))
        promocode.status = promocode.dateStart < new Date(Date.now()) ? "created" : "running"
        await promocode.save()

		return res.end()
	} catch (e: any) {
		logger.error(e)
        if ( e.userError ) {
            return res.status(500).json({ message: e.message })
        }
		return res.status(500).json({ message: "Ошибка. Промокод не создан..." })
	}
})

router.delete("/promocode/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			return res.status(500).json({ message: "Ошибка. Промокод не удален..." })
		}

		await client.refreshPromocodes()

		const { id } = req.params
		const promocode = await PromocodeModel.findById(id)
		if (!promocode) {
			throw new Error(`Промокод ${id} не найден`)
		}

		if (promocode.status === "running") {
			return res.status(500).json({ message: "Нельзя удалить действующий промокод" })
		}

		if (promocode.status === "stopped") {
			return res.status(500).json({ message: "Нельзя удалить остановленный промокод" })
		}

		if (promocode.status === "finished") {
			return res.status(500).json({ message: "Нельзя удалить завершенный промокод" })
		}

        if ( client.promocodes ) {
            const index = client.promocodes.findIndex((item) => item.toString() === id)
			if (index !== -1) {
				client.promocodes.splice(index, 1)
                await client.save()
			}
        }
        await PromocodeModel.findByIdAndDelete(id)

		return res.end()
	} catch (e: any) {
		logger.error(e)
		if (e.userError) {
			return res.status(500).json({ message: e.message })
		}
		return res.status(500).json({ message: "Ошибка. Промокод не удален..." })
	}
})

export default router