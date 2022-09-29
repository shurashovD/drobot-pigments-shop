import { createTrade } from '../amoAPI/amoApi'
import ClientModel from '../models/ClientModel'
import OrderModel from '../models/OrderModel'
import { updTradeStatus } from './amoTradeStatus'

const createAmoTrade = async (orderId: string, clientId: string, number: string, paymentUrl?: string) => {
    try {
        const order = await OrderModel.getOrder(orderId)
        const client = await ClientModel.findById(clientId)
        if ( !order ) {
            throw new Error(`Заказ ${orderId} не найден. Создание заказа в Амо`)
        }
        if (!client) {
			throw new Error(`Клиент ${clientId} не найден. Создание заказа в Амо`)
		}
        if (!client.amoContactId) {
			throw new Error(`Клиент ${clientId} не пирвязан к Амо. Создание заказа в Амо`)
		}

		let products = order.products.map(({ product, quantity }) => ({ name: product.name, quantity }))

		const variants = order.variants.map(({ product, variant, quantity }) => {
			const name = product.variants.find(({ _id }) => _id?.toString() === variant.toString())?.name || "Неизвестный товар"
			return { name, quantity }
		})
		products = products.concat(variants)

		const price = order.total
		const { _embedded } = await createTrade(client.amoContactId, products, price, number, paymentUrl)
        const tradeId = _embedded.leads[0].id
        await OrderModel.findByIdAndUpdate(orderId, { tradeId })
        await updTradeStatus(tradeId, "invoiceIssued")
	} catch (e) {
		throw e
	}
}

export default createAmoTrade
