import { createTrade, createTask } from './../amoAPI/amoApi';
import { getMsOrder, updateMsOrder } from './../moyskladAPI/orders';
import { ICreateWebHook } from "@a2seven/yoo-checkout";
import bodyParser from "body-parser";
import { Request, Router } from "express";
import { IUKassaNotice } from "../../shared";
import OrderModel from "../models/OrderModel";
import { acceptPayment } from "../moyskladAPI/orders";
import { createUKHook, deleteUKHooks, getUKHooks } from "../ukassaAPI/hooks";
import createSdekOrderHandler from '../handlers/createSdekOrderHandler';
import { getUKPayment } from '../ukassaAPI/payments';
import ClientModel from '../models/ClientModel';
import PromocodeModel from '../models/PromocodeModel';

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
        const orderObj = await OrderModel.getOrder(order?._id.toString())
        const client = await ClientModel.findById(order?.client)
        if ( !order ) {
             return res.end()
        }
        if ( !order?.msOrderId ) {
            return res.end()
        }
        if (status === "succeeded") {
			// проведение оплаты в "Мой склад";
			await OrderModel.setPaymentStatus(order._id.toString(), { status })
			const sum = parseFloat(amount.value) - (order.delivery.sdek?.cost || 0)
			await acceptPayment(order.msOrderId, sum)

			// создание заказа в СДЭК;
			const uuid = await createSdekOrderHandler(order._id.toString())

			// привязка заявки СДЭК к заказу в "Мой склад";
			const msOrder = await getMsOrder(order.msOrderId)
			await updateMsOrder(order.msOrderId, { shipmentAddress: `${msOrder.shipmentAddress || ""}; СДЭК ${uuid}` })

			// сохранение uuid заказа СДЭК в заказе БД;
			order.delivery.sdek = { ...order.toObject().delivery.sdek, uuid }
			order.status = "compiling"
			await order.save()

			// обработка бонусов заказа;
			if (!client) {
				return
			}
			client.total = (client.total || 0) + order.total
			await client.save()

			// если покупатель розничный;
			if (client.status === "common") {
				// если применён промокод;
				if (order.promocode) {
					// начислить кэшбэк владельцу промокода;
					const promocode = await PromocodeModel.findById(order.promocode)
					if (promocode) {
						const promocodeHolder = await ClientModel.findById(promocode.holderClient)
						if (promocodeHolder) {
							const cashBack = Math.round(order.total * 0.1)
							if (promocodeHolder.status === "agent") {
								await promocodeHolder.addCashBack(cashBack)
								await promocodeHolder.save()
								promocode.promocodeTotalCashBack += cashBack
								promocode.orders.unshift({ orderId: order._id, cashBack })
								await promocode.save()
							}
							if (promocodeHolder.status === "delegate") {
								await promocodeHolder.addCashBack(cashBack)
								await promocodeHolder.save()
								promocode.promocodeTotalCashBack += cashBack
								promocode.orders.unshift({ orderId: order._id, cashBack })
								await promocode.save()
							}
						}
					}
				} else {
					// начислить накопительную скидку покупателю;
					client.commonOrders.unshift(order._id)
					await client.save()
				}
			}

			// если покупатель - агент;
			if (client.status === "agent") {
				client.agentOrders.push(order._id)
				await client.save()
			}

			// если покупатель - пердставитель;
			if (client.status === "delegate") {
				client.delegateOrders.push(order._id)
				await client.save()
			}

            // отправление заказа м Амо;
            if ( client.status && client.amoContactId ) {
                try {
                    let products = orderObj.products.map(({ product, quantity }) => ({ name: product.name, quantity }))
					
                    const variants = orderObj.variants.map(({ product, variant, quantity }) => {
                        const name = product.variants.find(({ _id }) => (_id?.toString() === variant.toString()))?.name || 'Неизвестный товар'
                        return { name, quantity }
                    })
                    products = products.concat(variants)

                    const price = orderObj.total
                    const trade = await createTrade(client.amoContactId, products, price)
					console.log(trade._embedded)
                } catch (e) {
                    console.log(e)
                }
            }
		}
        if (status === "canceled") {
            // получение причины отмены платежа;
            const { cancellation_details } = await getUKPayment(id)
            if ( cancellation_details ) {
                const { reason: cancelationReason } = cancellation_details
                await OrderModel.setPaymentStatus(order._id.toString(), { status, cancelationReason })
            } else {
                await OrderModel.setPaymentStatus(order._id.toString(), { status })
            }
            await updateMsOrder(order.msOrderId, { description: "Произошла ошибка при оплате, ожидаем оплаты" })
            
            // создание задачи в Амо;
            if ( client && client.amoContactId ) {
                const text = `Заказ ${order.number} не оплачен. Произошла ошибка оплаты.`
                await createTask(text, client.amoContactId)
            }
        }
        if (status === "waiting_for_capture") {
			await updateMsOrder(order.msOrderId, {
				description: "Ожидает подтверждения оплаты в ЛК Ю-Касса",
			})
		}
        return res.end()
	} catch (e) {
		console.log(e)
		return res.end()
	}
})

export default router