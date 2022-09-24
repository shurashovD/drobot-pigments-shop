import createMsOrder from '../moyskladAPI/orders';
import OrderModel from '../models/OrderModel'
import { getCity, getPointName } from '../sdekAPI/staticData';
import ClientModel from '../models/ClientModel';

const createMsOrderHandler = async (orderId: string) => {
	try {
		const order = await OrderModel.getOrder(orderId)
		if ( !order ) {
			const err = new Error(`Не удалось получить заказ ${orderId}`)
			err.userError = true
			err.sersviceInfo = 'Создание заказа в МС'
			throw err
		}

		const { sdek, pickup } = order.delivery
		if ( !sdek && !pickup ) {
			const err = new Error(`Отсутвуют параметры доставки в заказе ${orderId}`)
			err.userError = true
			err.sersviceInfo = "Создание заказа в МС"
			throw err
		}

		const positions: { quantity: number; price: number; productId?: string; variantId?: string; discount?: number }[] = [
			...order.products.map(({ price, product, quantity, discountOn, paidByCashBack }) => {
				const discount = discountOn ? ((discountOn + (paidByCashBack || 0)) / price) * 100 : discountOn
				return { price: price, quantity, productId: product.identifier, discount }
			}),
			...order.variants.map(({ price, product, variant, quantity, discountOn, paidByCashBack }) => {
				const discount = discountOn ? ((discountOn + (paidByCashBack || 0)) / price) * 100 : discountOn
				const variantId = product.variants.find(({ _id }) => _id?.toString() === variant.toString())?.identifier
				return { price: price, quantity, variantId, discount }
			}),
		]

		let city = 'Краснодар'
		let addressString = 'Самовывоз из магазина'
		let point
		if ( sdek ) {
			const { city_code, address, point_code, tariff_code } = sdek
			addressString = `До${tariff_code === 138 ? " ПВЗ" : " "}${tariff_code === 139 ? "адреса" : ""}${
				tariff_code === 366 ? "постамата" : ""
			}, ${address || ""}`
			city = await getCity(city_code)

			if (point_code) {
				point = await getPointName(point_code)
			}
		}
		
		try {
			const msOrder = await createMsOrder(
				{ city, address: addressString, point, positions, counterpartyId: order.client.counterpartyId }, order.delivery.pickup?.checked
			)
			return msOrder
		} catch (e: any) {
			const client = await ClientModel.findById(order.client._id)
			await client?.deleteOrder(orderId)
			e.userError = true
			e.sersviceInfo = "Создание заказа в МС"
			throw e
		}
	} catch (e) {
		throw e
	}
}

export default createMsOrderHandler