import { createUKPayment } from './../ukassaAPI/payments'
import OrderModel from '../models/OrderModel';

const createPaymentHandler = async (orderId: string) => {
    try {
		const order = await OrderModel.getOrder(orderId)
		if (!order) {
			const err = new Error(`Не удалось получить заказ ${orderId}`)
			err.userError = true
			err.sersviceInfo = "Создание платежа Ю-Касса"
			throw err
		}

		const { sdek } = order.delivery
		if (!sdek) {
			const err = new Error(`Отсутвуют параметры СДЭК в заказе ${orderId}`)
			err.userError = true
			err.sersviceInfo = "Создание платежа Ю-Касса"
			throw err
		}
		
        const items: any[] = order.products
			.map(({ price, product, quantity }) => ({
				amount: { value: price.toFixed(2), currency: "RUB" },
				description: product.name,
				quantity,
				vat_code: 1,
			}))
			.concat(
				order.variants.map(({ product, variant, price, quantity }) => {
					const variantObj = product.variants.find(({ _id }) => _id?.toString() === variant.toString())
					return {
						amount: { value: price.toFixed(2), currency: "RUB" },
						description: `${product.name} ${variantObj?.name || ""}`,
						quantity,
						vat_code: 1,
					}
				})
			)

        const { id, url } = await createUKPayment({
			amount: { currency: "RUB", value: (+(order.msOrderSumRub || 0) + +(sdek.cost || 0)).toFixed(2) },
			capture: "true",
			confirmation: {
				type: "redirect",
				return_url: `https://drobot-pigments-shop.ru/payment/${order.id}`,
			},
			description: `Оплата заказа ${order.number} из drobot-pigments-shop`,
			metadata: { orderSum: order.msOrderSumRub || 0, deliverySum: sdek.cost || 0, msOrderId: order.msOrderId },
			receipt: {
				email: order.client.mail || "",
				phone: order.client.tel,
				items: items.concat({
					amount: { value: (sdek.cost || 0).toFixed(2), currency: "RUB" },
					description: "Доставка",
					quantity: "1",
					vat_code: 1,
				}),
			},
		})
		if (!url) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = 'Отсутствует url платежа. Создание платежа'
			throw err
		}
		return { id, url }
    } catch (e) { throw e }
}

export default createPaymentHandler