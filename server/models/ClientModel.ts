import OrderModel from './OrderModel'
import { ClientModel, ICart, IClient, IOrder, IOrderPop } from '../../shared';
import { model, Schema, Types } from 'mongoose'
import CommonDiscountModel from './CommonDiscountModel';
import AgentDiscountModel from './AgentDiscountModel';
import DelegateDiscountModel from './DelegateDiscountModel';
import CartModel from './CartModel';

const ClientSchema = new Schema<IClient, ClientModel>({
	addresses: [String],
	amoContactId: Number,
	cartId: { type: Schema.Types.ObjectId, ref: 'Cart' },
	counterpartyId: String,
	mail: String,
	name: String,
	orders: [{ type: Types.ObjectId, ref: "Order" }],
	agentOrders: [{ type: Types.ObjectId, ref: "Order" }],
	commonOrders: [{ type: Types.ObjectId, ref: "Order" }],
	delegateOrders: [{ type: Types.ObjectId, ref: "Order" }],
	cashBack: Number,
	claimedStatus: String,
	promocodes: [{ type: Schema.Types.ObjectId, ref: 'Promocode' }],
	status: String,
	tel: { type: String, required: true },
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
		const order = await OrderModel.find({
			_id: { $in: this.orders },
			status: { $in: ["compiling", "builded", "dispatch", "delivering", "ready"] },
		})
			.sort({ date: -1 })
			.limit(1)

		if ( order[0] ) {
			return await OrderModel.getOrder(order[0]._id.toString())
		}
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.getDiscount = async function (this: IClient): Promise<{ discountPercentValue?: number; nextLevelRequires: string[] }> {
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
			const discountPercentValue = commonDiscounts[myDiscountLevelIndex]?.percentValue || 0
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
			return { discountPercentValue: agentDiscount.percentValue, nextLevelRequires: ["Максимальный уровень скидки"] }
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

ClientSchema.methods.createTempOrder = async function (this: IClient, sdek: IOrder["delivery"]["sdek"]): Promise<string> {
	try {
		if ( !this.cartId ) {
			throw new Error(`Корзина не найдена у клиента ${this._id.toString()}`)
		}

		const cart = await CartModel.findById(this.cartId)
		if ( !cart ) {
			throw new Error(`Корзина не найдена у клиента ${this._id.toString()}`)
		}

		const productsForOrder = cart.products.filter(({ checked }) => checked)
			.map(item => ({ ...item, product: item.productId }))
		const variantsForOrder = cart.variants
			.filter(({ checked }) => checked)
			.map((item) => ({ ...item, product: item.productId, variant: item.variantId }))

		const order = await new OrderModel({
			client: this._id,
			date: new Date(),
			delivery: { sdek },
			products: productsForOrder,
			variants: variantsForOrder,
			total: cart.total,
		}).save()

		this.orders.unshift(order._id)
		await this.save()
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

ClientSchema.methods.addCashback = async function (this: IClient, cashbackRub: number): Promise<void> {
	try {
		this.cashBack = (this.cashBack || 0) + cashbackRub
		await this.save()
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.mergeCart = async function (this: IClient, mergedCartId: string): Promise<void> {
	try {
		// если присоединяемая корзина не найдена, выход;
		const mergedCart = await CartModel.findById(mergedCartId)
		if (!mergedCart) {
			return
		}

		// если у клиента уже есть корзина;
		if ( this.cartId ) {
			// если у клиента нет корзины, то его корзиной становится присоединяемая;
			const myCart = await CartModel.findById(this.cartId)
			if (!myCart) {
				this.cartId = mergedCart?._id
				await this.save()
				return
			}
			// если корзина есть, то в неё добавляются товары из присоединяемой корзины;
			myCart.products.concat(mergedCart.products)
			myCart.variants.concat(mergedCart.variants)
			
			// удаление присоединяемой корзины;
			await CartModel.findByIdAndDelete(mergedCartId)
		}
		// если у клиента нет корзины, то его корзиной становится присоединяемая;
		else {
			this.cartId = mergedCart?._id
		}
		await this.save()
	} catch (e) { throw e }
}

const ClientModel = model<IClient, ClientModel>('Client', ClientSchema)

export default ClientModel