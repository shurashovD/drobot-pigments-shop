import { sdekGetOrderInfo } from './../sdekAPI/orders';
import { json } from "body-parser"
import { Request, Router } from "express"
import { INearestOrder } from "../../shared"
import { createContact, updateContact } from "../amoAPI/amoApi"
import ClientModel from '../models/ClientModel'
import { createMsCounterParty, editMsCounterParty } from "../moyskladAPI/counterparty"
import errorHandler from '../handlers/errorLogger';

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
        const prefix = client.tel.substring(0, 3)
        const first = client.tel.substring(3, 6)
        const second = client.tel.substring(6, 8)
        const fird = client.tel.substring(8, 10)
        const phone = `+7 (${prefix}) ${first}-${second}-${fird}`

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
            await updateContact(client.amoContactId.toString(), name, phone, email)
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
    catch (e: any) { errorHandler(e, req, res) }
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
				throw e
            }
            return res.json(response)
        } else {
            return res.end()
        }
	} catch (e: any) {
		errorHandler(e, req, res)
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
    catch (e: any) { errorHandler(e, req, res) }
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
        console.log(e)
        return res.end()
	}
})

export default router