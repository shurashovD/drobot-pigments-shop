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

		const { sdek } = order.delivery
		if ( !sdek ) {
			const err = new Error(`Отсутвуют параметры СДЭК в заказе ${orderId}`)
			err.userError = true
			err.sersviceInfo = "Создание заказа в МС"
			throw err
		}

		const { city_code, address, point_code, tariff_code } = sdek
		const addressString = `До ${tariff_code === 138 && "ПВЗ"} ${tariff_code === 139 && "адреса"} ${
			tariff_code === 366 && "постамата"
		}, ${address}`
		const city = await getCity(city_code)

		let point
		if (point_code) {
			point = await getPointName(point_code)
		}

		const positions: { quantity: number; price: number; productId?: string; variantId?: string, discount?: number }[] =
			order.products.map(({ price, product, quantity, discountOn }) => {
				const discount = discountOn ? Math.round(discountOn / price) * 100 : discountOn
				return { price: price * 100, quantity, productId: product.identifier, discount }
			})

		try {
			const msOrder = await createMsOrder({ city, address: addressString, point, positions, counterpartyId: order.client.counterpartyId })
			return msOrder
		} catch (e: any) {
			await order.client.deleteOrder(orderId)
			e.userError = true
			e.sersviceInfo = "Создание заказа в МС"
			throw e
		}
	} catch (e) {
		throw e
	}
}

export default createMsOrderHandler