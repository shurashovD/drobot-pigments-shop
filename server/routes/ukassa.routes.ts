import { updateMsOrder } from './../moyskladAPI/orders';
import { ICreateWebHook } from "@a2seven/yoo-checkout";
import bodyParser from "body-parser";
import { Request, Router } from "express";
import { IUKassaNotice } from "../../shared";
import OrderModel from "../models/OrderModel";
import { acceptPayment } from "../moyskladAPI/orders";
import { createUKHook, deleteUKHooks, getUKHooks } from "../ukassaAPI/hooks";

const router = Router()

router.get('/hooks', async (req, res) => {
    try {
        const hooks = await getUKHooks()
        return res.json({ hooks })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post("/hooks", bodyParser.json(), async (req: Request<{}, {}, ICreateWebHook>, res) => {
	try {
        await createUKHook(req.body)
		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.delete("/hooks/:id", bodyParser.json(), async (req: Request<{id: string}>, res) => {
	try {
        const { id } = req.params
        await deleteUKHooks(id)
		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post('/handle', bodyParser.json(), async (req: Request<{}, {}, IUKassaNotice>, res) => {
    try {
		const { object } = req.body
        const { id, status, amount } = object
        const order = await OrderModel.findOne({ 'payment.paymentId': id })
        if ( !order ) {
             return res.end()
        }
        if ( order.payment ) {
            order.payment.status = status
            order.payment.probably = status === "succeeded"
            await order.save()
        }
        if ( !order?.msOrderId ) {
            throw new Error(`В заказе ${order._id.toString()} не указан id заказа Мой склад`)
        }
        if (status === "succeeded") {
            const sum = parseFloat(amount.value) - (order.delivery.sdek?.cost || 0)
			await acceptPayment(order.msOrderId, sum)
        }
        if (status === "canceled") {
            await updateMsOrder(order.msOrderId, { description: 'Ошибка оплаты' })
        }
        if (status === "waiting_for_capture") {
			await updateMsOrder(order.msOrderId, {
				description: "Ожидает подтверждения оплаты в Ю-Касса",
			})
		}
        return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router