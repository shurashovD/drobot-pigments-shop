import OrderModel from './OrderModel'
import { ClientModel, IClient, IOrder, IOrderPop } from '../../shared';
import { model, Schema, Types } from 'mongoose'
import CommonDiscountModel from './CommonDiscountModel';
import AgentDiscountModel from './AgentDiscountModel';
import DelegateDiscountModel from './DelegateDiscountModel';

const ClientSchema = new Schema<IClient, ClientModel>({
    addresses: [String],
    amoContactId: Number,
    counterpartyId: String,
    mail: String,
    name: String,
    orders: [{ type: Types.ObjectId, ref: 'Order' }],
	status: String,
    tel: { type: String, required: true }
})

ClientSchema.methods.getOrder = async function(this: IClient, id: string): Promise<IOrderPop> {
	try {
        if (!this.orders.some(({ _id }) => _id.toString() === id)) {
            const err = new Error("Заказ не найден")
			err.userError = true
			err.sersviceInfo = `Получение деталей заказа. Заказ ${id} не найден в списке заказов пользователя ${this._id.toString()}`
			throw err
        }

		const order = await OrderModel.getOrder(id)
		if (!order) {
			const err = new Error("Заказ не найден")
			err.userError = true
			err.sersviceInfo = `Получение деталей заказа. Заказ ${id} не найден. Пользователь ${this._id.toString()}`
			throw err
		}

		return order
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.getNearestOrder = async function(this: IClient): Promise<IOrderPop | undefined> {
	try {
		const order = await OrderModel.find({ _id: { $in: this.orders }, status: "deliveried" })
			.sort({ date: -1 }).limit(1)

		if ( order[0] ) {
			return await OrderModel.getOrder(order[0]._id.toString())
		}
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.getDiscount = async function (this: IClient): Promise<{ discountPercentValue?: string; nextLevelRequires: string[] }> {
	try {
		const formatter = new Intl.NumberFormat('ru', { currency: 'RUB', maximumFractionDigits: 0 })
		if (this.status === 'common') {
			const commonOrdersTotal = await OrderModel.find({ _id: { $in: this.commonOrders } })
				.then(doc => doc.reduce((sum, { total }) => sum + (total || 0), 0))
			const commonDiscounts = await CommonDiscountModel.find().sort({ lowerTreshold: -1 })
			if (commonDiscounts.length === 0) {
				return { nextLevelRequires: ["Бонусная программа не активна"] }
			}

			const myDiscountLevelIndex = commonDiscounts.findIndex(({ lowerTreshold }) => (lowerTreshold <= commonOrdersTotal ))
			const discountPercentValue = `${commonDiscounts[myDiscountLevelIndex]?.percentValue || 0}%`
			let nextLevelRequires = ['Максимальный уровень скидки']
			if ( myDiscountLevelIndex !== commonDiscounts.length ) {
				const nextDiscountPercentValue = commonDiscounts[myDiscountLevelIndex + 1].percentValue
				const nextDiscountRemind = commonDiscounts[myDiscountLevelIndex + 1].lowerTreshold - commonOrdersTotal
				nextLevelRequires = [`До скидки ${nextDiscountPercentValue}% осталось ${formatter.format(nextDiscountRemind)}`]
			}
			return { discountPercentValue, nextLevelRequires }
		}

		if (this.status === 'agent') {
			const agentDiscount = await AgentDiscountModel.findOne()
			if (!agentDiscount) {
				return { nextLevelRequires: ["Бонусная программа не активна"] }
			}
			return { discountPercentValue: `${agentDiscount.percentValue}%`, nextLevelRequires: ["Максимальный уровень скидки"] }
		}

		if (this.status === 'delegate') {
			const delegateDiscounts = await DelegateDiscountModel.find().sort({ lowerTreshold: 1 })
			if ( delegateDiscounts.length === 0 ) {
				return { nextLevelRequires: ["Бонусная программа не активна"] }
			}
			const nextLevelRequires = delegateDiscounts.map(
				({ lowerTreshold, percentValue }) => `${percentValue}% на заказ от ${formatter.format(lowerTreshold)}`
			)
			return { nextLevelRequires }
		}
		return { nextLevelRequires: ["Бонусная программа не активна"] }
	}
	catch (e) {
		throw e
	}
}

ClientSchema.methods.createTempOrder = async function (
	this: IClient,
	sdek: IOrder["delivery"]["sdek"],
	products: {
		productId: string
		quantity: number
		price: number
		discountOn?: number
	}[],
	variants: {
		productId: string
		variantId: string
		quantity: number
		price: number
		discountOn?: number
	}[]
): Promise<string> {
	try {
		const total = products
			.map(({ price, discountOn }) => price - (discountOn || 0))
			.concat(variants.map(({ price, discountOn }) => price - (discountOn || 0)))
			.reduce((total, item) => total + item, 0)
		const order = await new OrderModel({
			client: this._id,
			date: new Date(),
			delivery: { sdek },
			products: products.map((item) => ({ ...item, product: item.productId })),
			variants: variants.map((item) => ({ ...item, product: item.productId, variant: item.variantId })),
			total
		}).save()

		this.orders.push(order._id)
		return order._id.toString()
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.deleteOrder = async function (this: IClient, orderId: string): Promise<void> {
	try {
		await OrderModel.findByIdAndDelete(orderId)

		const index = this.orders.findIndex((item) => item.toString() === orderId)
		if ( index !== -1 ) {
			this.orders.splice(index, 1)
			await this.save()
		}
	} catch (e) { throw e }
}

const ClientModel = model<IClient, ClientModel>('Client', ClientSchema)

export default ClientModel