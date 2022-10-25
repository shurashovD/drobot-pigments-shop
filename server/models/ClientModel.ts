import OrderModel from './OrderModel'
import { ClientModel, ICashbackReport, IClient, IDebiteReport, IOrder, IOrderPop, IPromocode, IPromocodeDetails, IPromocodeDoc } from '../../shared';
import { model, Schema, Types } from 'mongoose'
import CommonDiscountModel from './CommonDiscountModel';
import AgentDiscountModel from './AgentDiscountModel';
import DelegateDiscountModel from './DelegateDiscountModel';
import CartModel from './CartModel';
import PromocodeModel from './PromocodeModel';
import getCounterPartyByNumber from '../moyskladAPI/counterparty'
import { createContact, getContactByPhone } from '../amoAPI/amoApi';

const ClientSchema = new Schema<IClient, ClientModel>({
	addresses: [String],
	amoContactId: Number,
	cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
	counterpartyId: String,
	mail: String,
	name: String,
	orders: [{ type: Types.ObjectId, ref: "Order" }],
	agentOrders: [{ type: Types.ObjectId, ref: "Order" }],
	coachOrders: [{ type: Types.ObjectId, ref: "Order" }],
	commonPoints: Number,
	commonOrders: [{ type: Types.ObjectId, ref: "Order" }],
	delegateOrders: [{ type: Types.ObjectId, ref: "Order" }],
	cashBack: Number,
	totalCashBack: Number,
	cashbackDebites: [{ date: Date, total: Number, orderId: { type: Types.ObjectId, ref: "Order" } }],
	claimedStatus: String,
	promocodes: [{ type: Schema.Types.ObjectId, ref: "Promocode" }],
	status: String,
	sid: String,
	tel: { type: String, required: true },
	total: { type: Number, default: 0 },
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
			const commonOrdersTotal = this.commonPoints || 0
			const commonDiscounts = await CommonDiscountModel.find().sort({ lowerTreshold: -1 })
			if (commonDiscounts.length === 0) {
				return { nextLevelRequires: ["Бонусная программа не активна"] }
			}

			const myDiscountLevelIndex = commonDiscounts.findIndex(({ lowerTreshold }) => (lowerTreshold <= commonOrdersTotal ))
			const discountPercentValue = commonDiscounts[myDiscountLevelIndex]?.percentValue || 0

			let nextLevelRequires = ["У вас максимальный уровень скидки"]
			if ( myDiscountLevelIndex === -1 ) {
				const nextDiscountPercentValue = commonDiscounts[commonDiscounts.length - 1]?.percentValue
				const nextDiscountRemind = commonDiscounts[commonDiscounts.length - 1]?.lowerTreshold - commonOrdersTotal
				nextLevelRequires = [`До скидки ${nextDiscountPercentValue}% осталось ${formatter.format(nextDiscountRemind)}`]
			}

			if ( myDiscountLevelIndex > 0 ) {
				const nextDiscountPercentValue = commonDiscounts[myDiscountLevelIndex - 1]?.percentValue
				const nextDiscountRemind = commonDiscounts[myDiscountLevelIndex - 1]?.lowerTreshold - commonOrdersTotal
				nextLevelRequires = [`До скидки ${nextDiscountPercentValue}% осталось ${formatter.format(nextDiscountRemind)}`]
			}
			return { discountPercentValue, nextLevelRequires }
		}

		if (this.status === 'agent') {
			const agentDiscount = await AgentDiscountModel.findOne()
			if (!agentDiscount) {
				return { nextLevelRequires: ["Бонусная программа не активна"] }
			}
			return { discountPercentValue: agentDiscount?.percentValue || 0, nextLevelRequires: ["У вас максимальный уровень скидки"] }
		}

		if (this.status === 'delegate' || 'coach') {
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
	args: { sdek?: IOrder["delivery"]["sdek"]; pickup?: IOrder["delivery"]["pickup"]; recipientMail?: string; recipientName?: string }
): Promise<string> {
	try {
		if (!this.cartId) {
			throw new Error(`Корзина не найдена у клиента ${this._id.toString()}`)
		}

		const cart = await CartModel.findById(this.cartId)
		if (!cart) {
			throw new Error(`Корзина не найдена у клиента ${this._id.toString()}`)
		}

		const { sdek, recipientMail, recipientName, pickup } = args

		const productsForOrder = cart.products.filter(({ checked }) => checked).map((item) => ({ ...item, product: item.productId }))
		const variantsForOrder = cart.variants
			.filter(({ checked }) => checked)
			.map((item) => ({ ...item, product: item.productId, variant: item.variantId }))

		const order = await new OrderModel({
			client: this._id,
			date: new Date(),
			delivery: { sdek, recipientMail, recipientName, pickup },
			products: productsForOrder,
			variants: variantsForOrder,
			total: cart.total,
		}).save()

		if (cart.useCashBack && cart.availableCashBack) {
			this.debiteCashback(cart.availableCashBack, order._id)
			cart.useCashBack = false
			await cart.save()
		}

		if (cart.promocode?.promocodeId) {
			order.promocode = new Types.ObjectId(cart.promocode.promocodeId)
			await order.save()
		}

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
		this.totalCashBack = (this.totalCashBack || 0) + cashbackRub
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
			const myCartProductIds = myCart.products.map(({ productId }) => (productId.toString()))
			const myCartVariantIds = myCart.variants.map(({ variantId }) => (variantId.toString()))
			myCart.products = myCart.products.concat(
				mergedCart.products.filter(({ productId }) => !(myCartProductIds.includes(productId.toString())))
			)
			myCart.variants = myCart.variants.concat(
				mergedCart.variants.filter(({ variantId }) => !(myCartVariantIds.includes(variantId.toString())))
			)
			await myCart.save()
			
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

ClientSchema.methods.refreshPromocodes = async function (this: IClient): Promise<void> {
	try {
		if (this.status !== "agent" && this.status !== "delegate" && this.status !== "coach") {
			return
		}

		const promocodes = await PromocodeModel.find({ _id: { $in: this.promocodes }, status: { $nin: ["stopped", "finished"] } })
		for (const i in promocodes) {
			const promocode = promocodes[i]
			let freshStatus: IPromocode["status"] = "running"
			if (promocode.dateStart < new Date(Date.now())) {
				freshStatus = "running"
			} else {
				freshStatus = "created"
			}
			if (promocode.dateFinish < new Date(Date.now())) {
				freshStatus = "finished"
			}
			if (promocode.status !== freshStatus) {
				promocode.status = freshStatus
				await promocode.save()
			}
		}
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.getPromocodes = async function (this: IClient): Promise<IPromocodeDetails[]> {
	try {
		if (this.status !== "agent" && this.status !== "delegate" && this.status !== 'coach') {
			return []
		}

		await this.refreshPromocodes()

		const promocodes = await PromocodeModel.find({ _id: { $in: this.promocodes } })
			.sort({ dateStart: -1 })
			.populate<{ orders: { cashBack: number; orderId: Omit<IOrder, 'client'> & { client: IClient } }[] }>({
				path: "orders",
				populate: {
					path: "orderId",
					populate: { path: "client" },
				},
			})
			.then((doc) =>
				doc.map<IPromocodeDetails>((item) => {
					const { code, dateFinish, dateStart, _id, promocodeTotalCashBack, orders } = item
					let status: IPromocodeDetails['status'] = 'created'
					if ( item.status === 'stopped' || 'finished' ) {
						status = item.status
					}
					if ( dateStart >= new Date() ) {
						status = 'running'
					}
					if (dateFinish <= new Date()) {
						status = "finished"
					}
 					const ordersRes = orders.map<IPromocodeDetails["orders"][0]>(({ cashBack, orderId }) => {
						const client = orderId?.client || 'Не доступно'
						const total = orderId?.total || 0
						const _id = orderId?._id || (Date.now() + Math.random())
						const number = orderId?.number || 'Не доступно'
						return {
							buyer: client.name || 'Неизвестный покупатель', orderCashBack: cashBack, orderTotal: total, orderId: _id.toString(), orderNumber: number.toString()
						}
					})
					const ordersTotal = orders.reduce((sum, { orderId }) => orderId?.total || 0 + sum, 0)
					const total: IPromocodeDetails["total"] = {
						ordersLength: orders.length,
						ordersTotal,
						totalCashBack: promocodeTotalCashBack,
					}
					const discountPercentValue = item.discountPercent
					return { code, dateFinish, dateStart, discountPercentValue, id: _id.toString(), status, total, orders: ordersRes }
				})
			)

		return promocodes

	} catch (e) { throw e }
}

ClientSchema.methods.createPromocode = async function (this: IClient, code: string, dateFinish: string, dateStart: string, discountPercent = 5): Promise<void> {
	try {
		if (this.status !== "agent" && this.status !== "delegate" && this.status !== "coach") {
			const error = new Error("Промокоды не доступны для этого клиента")
			error.userError = true
			throw error
		}

		if ( new Date(Date.parse(dateFinish)) < new Date(Date.now()) ) {
			const error = new Error('Неверная дата окончания промокода')
			error.userError = true
			throw error
		}

		const cursor = await PromocodeModel.findOne({ code })
		if ( cursor ) {
			const error = new Error("Такой промокод уже есть")
			error.userError = true
			throw error
		}

		const promocode = await new PromocodeModel({
			code,
			dateFinish: new Date(Date.parse(dateFinish)),
			dateStart: new Date(Date.parse(dateStart)),
			discountPercent,
			holderClient: this._id
		}).save()

		if ( !this.promocodes ) {
			this.promocodes = [promocode._id]
		} else {
			this.promocodes.unshift(promocode._id)
		}

		await this.save()
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.setPromocodeInCart = async function (this: IClient, code: string): Promise<string | void> {
	try {
		if ( this.status !== 'common' ) {
			return 'Вы не можете использовать промокод'
		}
		
		const check = await PromocodeModel.check({ code })
		if ( check === 'invalid' ) {
			return 'Неверный промокод'
		}

		if ( check === 'expired' ) {
			return 'Промокод не действителен'
		}

		const cart = await CartModel.findById(this.cartId)
		if ( !cart ) {
			return
		}

		const promocode = await PromocodeModel.findOne({ code })
		if ( !promocode ) {
			return
		}

		cart.promocode = { code, promocodeId: promocode._id.toString() }
		await cart.save()
		
	} catch (e) { throw e }
}

ClientSchema.methods.resetPromocodeInCart = async function (this: IClient): Promise<void> {
	try {
		const cart = await CartModel.findById(this.cartId)
		if (!cart) {
			return
		}

		cart.promocode = undefined
		delete cart.promocode
		await cart.save()
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.useCashbackToggle = async function (this: IClient): Promise<void> {
	try {
		if ( !(this.status === 'agent' || this.status === 'delegate' || this.status === 'coach') ) {
			return
		}

		const cart = await CartModel.findById(this.cartId)
		if (!cart) {
			return
		}

		cart.useCashBack = !cart.useCashBack
		await cart.save()
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.debiteCashback = async function (this: IClient, total: number, orderId?: Types.ObjectId): Promise<void> {
	try {
		if (!this.cashBack || this.cashBack < total) {
			const err = new Error("У клиента не достаточно кэшбэка")
			err.userError = true
			throw err
		}

		this.cashBack -= total
		if ( orderId ) {
			this.cashbackDebites.push({ date: new Date(), total, orderId })
		} else {
			this.cashbackDebites.push({ date: new Date(), total })
		}
		await this.save()
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.getCashbackReport = async function (this: IClient): Promise<ICashbackReport> {
	try {
		return await this.populate<{ promocodes: IPromocodeDoc[] }>('promocodes')
			.then(doc => {
				const promocodes = doc.promocodes.map(({ _id, code, promocodeTotalCashBack }: IPromocodeDoc) => (
					{ id: _id.toString(), code, cashbackTotal: promocodeTotalCashBack }
				))
				const totalCashback = this.totalCashBack || 0
				const availableCashBack = this.cashBack || 0
				const totalDebites = this.cashbackDebites.reduce((sum, { total }) => (sum + total), 0)
				const name = this.name || 'Неизвестный покупатель'
				const clientId = this._id.toString()
				return { availableCashBack, promocodes, totalCashback, totalDebites, name, clientId }
			})
	} catch (e) {
		throw e
	}
}

ClientSchema.methods.getDebitesReport = async function (this: IClient): Promise<IDebiteReport> {
	try {
		return await this.populate<{ cashbackDebites: Omit<IDebiteReport["debites"][0], "orderId"> & { orderId: IOrder }[] }>({
			path: "cashbackDebites",
			populate: { path: "orderId" },
		}).then((doc) => {
			const debites = doc.cashbackDebites.map<IDebiteReport["debites"][0]>(({ date, total, orderId }: any) => ({
				date,
				debite: total,
				orderId: orderId?._id.toString(),
				order: orderId?.number,
				orderTotal: orderId?.total,
			}))
			const name = this.name || "Неизвестный пользователь"
			return { debites, name }
		})
	} catch (e) {
		throw e
	}
}

ClientSchema.statics.createClient = async function (tel: string, name?: string, mail?: string): Promise<IClient> {
	try {
		let client
		const counterparty = await getCounterPartyByNumber(tel)
		if (counterparty) {
			client = await new ClientModel({
				counterpartyId: counterparty.id,
				name: counterparty.name,
				tel,
			}).save()
		} else {
			client = await new ClientModel({ tel }).save()
		}
		const amoContact = await getContactByPhone(tel)
		if (amoContact?.id) {
			client.amoContactId = amoContact.id
			await client.save()
		} else {
			const amoContact = await createContact(name || 'Покупатель с сайта', tel, mail)
			client.amoContactId = amoContact.id
			await client.save()
		}
		return client
	} catch (e) {
		throw e
	}
}

const ClientModel = model<IClient, ClientModel>('Client', ClientSchema)

export default ClientModel