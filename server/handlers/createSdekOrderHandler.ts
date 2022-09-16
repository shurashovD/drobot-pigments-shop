import { sdekCreateOrder } from './../sdekAPI/orders';
import { IOrderPop, ISdekOrderPayload } from './../../shared/index.d'
import OrderModel from '../models/OrderModel';

const createSdekOrderHandler = async (orderId: string) => {
    try {
        const order = await OrderModel.findById(orderId)
            .populate<{ products: IOrderPop['products'][0][], variants: IOrderPop['variants'][0][] }>([
                {
                    path: 'products',
                    populate: 'product'
                },
                {
                    path: 'variants',
                    populate: 'product'
                },
            ])

        if ( !order ) {
            const err = new Error(`Не найден заказ в БД ${orderId}`)
			err.userError = true
			err.sersviceInfo = "Создание заказа в СДЭК"
			throw err
        }
        if (!order.delivery.sdek) {
			const err = new Error(`Не найдена информация о доставке СДЭК ${orderId}`)
			err.userError = true
			err.sersviceInfo = "Создание заказа в СДЭК"
			throw err
		}
        const { city_code, number, address, point_code, tariff_code } = order.delivery.sdek
		const { recipientName: name = 'Покупатель' } = order.delivery
        if (tariff_code === 138 || tariff_code === 139 || tariff_code === 366) {
            const { products, variants } = order
            const items: ISdekOrderPayload["packages"][0]["items"] = products
				.map(({ price, product, quantity, discountOn, paidByCashBack }) => ({
					amount: quantity,
					cost: price - (discountOn || 0) - (paidByCashBack || 0),
					name: product.name,
					payment: { value: 0 },
					ware_key: product.identifier,
					weight: product.weight || 25 * quantity,
				}))
				.concat(
					variants.map(({ product, variant, quantity, price, discountOn, paidByCashBack }) => {
						const variantObj = product.variants.find(({ _id }) => _id?.toString() === variant.toString())
						const name = `${product.name} (${variantObj?.name || ""})`
						const cost = price - (discountOn || 0) - (paidByCashBack || 0)
						const payment = { value: 0 }
						const ware_key = variantObj?.identifier || ""
						const weight = 25 * quantity
						return { amount: quantity, cost, name, payment, ware_key, weight }
					})
				)

            const sdekPayload: ISdekOrderPayload = {
				number: order.msOrderId,
				tariff_code,
				recipient: { name, phones: [{ number }], number },
				from_location: { address: "Дзержинского 87/1", code: 435 },
				packages: [{ number, items, weight: items.reduce((total, { weight }) => total + weight, 0) }],
			}
			if (tariff_code === 139 && address) {
				sdekPayload.to_location = { address, code: city_code }
			}
			if ((tariff_code === 138 || tariff_code === 366) && point_code) {
				sdekPayload.delivery_point = point_code
			}
			const uuid = await sdekCreateOrder(sdekPayload)
            return uuid
        } else {
            const err = new Error("Неверное значение tariff_code")
			err.userError = true
			err.sersviceInfo = "Создание заказа в СДЭК"
            throw err
        }
        
    } catch (e) { throw e }
}

export default createSdekOrderHandler