import { updTradeStatus } from './../handlers/amoTradeStatus';
import { createTrade, createTask, setTradeSdekTrackId } from './../amoAPI/amoApi';
import { deleteMsOrder, getMsOrder, updateMsOrder } from './../moyskladAPI/orders';
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
import { logger } from '../handlers/errorLogger';
import ProductModel from '../models/ProductModel';
import { sdekGetOrderInfo } from '../sdekAPI/orders';

const router = Router()

router.get('/hooks', async (req, res) => {
    try {
        const hooks = await getUKHooks()
        return res.json({ hooks })
    }
    catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post("/hooks", bodyParser.json(), async (req: Request<{}, {}, ICreateWebHook>, res) => {
	try {
        await createUKHook(req.body)
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.delete("/hooks/:id", bodyParser.json(), async (req: Request<{id: string}>, res) => {
	try {
        const { id } = req.params
        await deleteUKHooks(id)
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post('/handle', bodyParser.json(), async (req: Request<{}, {}, IUKassaNotice>, res) => {
    try {
		const { object } = req.body
        const { id, status, amount } = object
        const order = await OrderModel.findOne({ 'payment.paymentId': id })
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
			if (!!order.delivery.sdek?.tariff_code) {
				const uuid = await createSdekOrderHandler(order._id.toString())
				if (uuid) {
					try {
						const sdekOrderInfo = await sdekGetOrderInfo(uuid)
						const sdekNumber = sdekOrderInfo?.number
						if (sdekNumber) {
							// добавление трэк-номера в сделку Амо;
							const trackUrl = `https://www.cdek.ru/ru/tracking?order_id=${sdekNumber}`
							try {
								if (order.tradeId && sdekNumber) {
									await setTradeSdekTrackId(order.tradeId, sdekNumber)
								}
							} catch (e) {
								console.log(e)
							}
							// привязка заявки СДЭК к заказу в "Мой склад";
							const msOrder = await getMsOrder(order.msOrderId)
							await updateMsOrder(order.msOrderId, { shipmentAddress: `${msOrder.shipmentAddress || ""}; СДЭК ${sdekNumber}` })
						}
					} catch (e) {
						logger.error(`Не удалось получить заказ СДЭК ${uuid}. Подтверждение оплаты заказа`)
					}
				}

				// сохранение uuid заказа СДЭК в заказе БД;
				order.delivery.sdek = { ...order.toObject().delivery.sdek, uuid }
			}

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
							// вычисляем сумму товаров, купленных по промокоду;
							const discountedProductsSum = order.products
								.filter(async ({ product }) => await ProductModel.isDiscounted(product.toString()))
								.reduce((sum, { price, quantity }) => sum + price * quantity, 0)
							// прибавляем к ней сумму модификаций, купленных по промокоду;
							const discountedSum = order.variants
								.filter(async ({ product }) => await ProductModel.isDiscounted(product.toString()))
								.reduce((sum, { price, quantity }) => sum + price * quantity, discountedProductsSum)

							// начисляем кэшбэк;
							const cashBack = Math.round(discountedSum * 0.1)
							await promocodeHolder.addCashback(cashBack)
							promocode.promocodeTotalCashBack += cashBack
							promocode.orders.unshift({ orderId: order._id, cashBack })
							await promocodeHolder.save()
							await promocode.save()

							// остальные товары начисляются баллами покупателю;
							client.commonPoints = (client.commonPoints || 0) + order.total - discountedSum
							client.commonOrders.unshift(order._id)
							await client.save()
						}
					}
				} else {
					// начислить накопительную скидку покупателю;
					client.commonPoints = (client.commonPoints || 0) + order.total
					client.commonOrders.unshift(order._id)
					await client.save()
				}
			}

			// если покупатель - агент;
			if (client.status === "agent") {
				client.agentOrders.push(order._id)
				await client.save()
			}

			// если покупатель - представитель;
			if (client.status === "delegate") {
				client.delegateOrders.push(order._id)
				await client.save()
			}

			// если покупатель - тренер;
			if (client.status === "coach") {
				client.coachOrders.push(order._id)
				await client.save()
			}

			// обновить статус в Амо;
			if (order.tradeId) {
				await updTradeStatus(order.tradeId, "invoicePaid")
			}
		}
        if (status === "canceled") {
			// получение причины отмены платежа;
			const { cancellation_details } = await getUKPayment(id)
			if (cancellation_details) {
				const { reason: cancelationReason } = cancellation_details
				await OrderModel.setPaymentStatus(order._id.toString(), { status, cancelationReason })
			} else {
				await OrderModel.setPaymentStatus(order._id.toString(), { status })
			}
			await deleteMsOrder(order.msOrderId)

			// создание задачи в Амо;
			if (client && client.amoContactId) {
				const text = `Заказ ${order.number} не оплачен. Произошла ошибка оплаты.`
				await createTask(text, client.amoContactId)
			}
			// обновить статус в Амо;
			if (order.tradeId) {
				await updTradeStatus(order.tradeId, "notCompleteClosed")
			}
		}
        if (status === "waiting_for_capture") {
			await updateMsOrder(order.msOrderId, {
				description: "Ожидает подтверждения оплаты в ЛК Ю-Касса",
			})
		}
        return res.end()
	} catch (e) {
		logger.error(e)
		return res.end()
	}
})

export default router