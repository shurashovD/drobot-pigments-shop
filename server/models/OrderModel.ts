import { IOrder, IOrderMethods, IOrderPop, IPromocodeDoc, OrderModel } from './../../shared/index.d';
import { model, Schema, Types } from "mongoose";
import ClientModel from './ClientModel';
import PromocodeModel from './PromocodeModel';
import ProductModel from './ProductModel';

const OrderSchema = new Schema<IOrder, OrderModel, IOrderMethods>({
	client: { type: Schema.Types.ObjectId, ref: "Client" },
	date: { type: Date, default: Date.now },
	delivery: {
		sdek: {
			address: String,
			city_code: Number,
			name: String,
			number: String,
			point_code: String,
			tariff_code: Number,
			uuid: String,
			cost: Number,
		},
		pickup: {
			checked: Boolean
		},
		recipientMail: String,
		recipientName: String
	},
	payment: {
		cancelationReason: String,
		paymentId: String,
		paymentUrl: String,
		status: String,
		probably: Boolean,
	},
	products: [
		{
			product: { type: Schema.Types.ObjectId, ref: "Product" },
			quantity: { type: Number, required: true },
			price: Number,
			discountOn: Number,
			paidByCashBack: Number
		},
	],
	promocode: { type: Schema.Types.ObjectId, ref: 'Promocode' },
	variants: [
		{
			product: { type: Schema.Types.ObjectId, ref: "Product" },
			variant: { type: Schema.Types.ObjectId, ref: "Variant" },
			quantity: { type: Number, required: true },
			price: Number,
			discountOn: Number,
			paidByCashBack: Number
		},
	],
	msOrderId: String,
	msOrderSumRub: Number,
	number: { type: Number, default: 1 },
	status: { type: String, default: "new" },
	tradeId: String,
	total: Number,
})

OrderSchema.statics.getOrder = async (id: string) => {
	try {
		const order = await Order.findById(id).populate<{ products: IOrderPop["products"][0][]; variants: IOrderPop["variants"][0][]; promocode: IPromocodeDoc }>([
			{ path: "client" },
			{ path: 'promocode' },
			{
				path: "products",
				populate: "product",
			},
			{
				path: "variants",
				populate: "product",
			},
		]).then(doc => {
			if ( !doc ) return doc
			if ( doc.promocode ) {
				const promocode: IOrderPop['promocode'] = { code: doc.promocode.code, id: doc.promocode._id.toString() }
				return { ...doc.toObject(), id: doc._id.toString(), promocode }
			}
			return { ...doc.toObject(), id: doc._id.toString() }
		})

		if ( !order ) {
			const err = new Error('Заказ не найден')
			err.userError = true
			err.sersviceInfo = `Получение деталей заказа. Заказ ${id} не найден`
			throw err
		}

		return order
	}
	catch (e) { throw e }
}

OrderSchema.statics.setMsInfo = async (id: string, args: { msOrderId: string; msOrderSumRub: number; number: number }) => {
	try {
		const order = await Order.findById(id)
		if (!order) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = `Заказ ${id} не найден. Установка свойств заказа МС`
			throw err
		}

		const { msOrderId, msOrderSumRub, number } = args
		order.msOrderId = msOrderId
		order.msOrderSumRub = msOrderSumRub
		order.number = number
		await order.save()
		return order
	} catch (e) {
		throw e
	}
}

OrderSchema.statics.setPaymentInfo = async (id: string, args: { paymentId: string; paymentUrl: string }) => {
	try {
		const order = await Order.findById(id)
		if (!order) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = `Заказ ${id} не найден. Установка информации об оплате`
			throw err
		}

		const { paymentId, paymentUrl } = args
		order.payment = { ...order.payment, paymentId, paymentUrl }
		await order.save()
		return order
	} catch (e) {
		throw e
	}
}

OrderSchema.statics.setPaymentStatus = async (id: string, args: { status: string, cancelationReason?: string }) => {
	try {
		const order = await Order.findById(id)
		if (!order) {
			const err = new Error()
			err.userError = true
			err.sersviceInfo = `Заказ ${id} не найден. Установка информации об оплате`
			throw err
		}

		const { status, cancelationReason } = args
		if (order.payment) {
			order.payment.status = status
			order.payment.probably = status === 'succeeded'
			if ( cancelationReason ) {
				order.payment.cancelationReason = cancelationReason
			}
		}
		await order.save()
		return order
	} catch (e) {
		throw e
	}
}

OrderSchema.methods.bonusHandle = async function(this: IOrder): Promise<void> {
	try {
		const client = await ClientModel.findById(this.client)
		if ( !client ) {
			const err = new Error('Баллы за заказ не начислены')
			err.userError = true
			err.sersviceInfo = `Клиент ${this.client} не найден. Начисление баллов заказ`
			throw err
		}

		// кэшбэк и скидка накапливаются только если покупку совершил розничный покупатель;
		if ( client.status !== 'common' ) {
			return
		}

		// при заказе был применён промокод;
		if ( this.promocode ) {
			const promocode = await PromocodeModel.getPromocode(this.promocode.toString())
			if ( !promocode ) {
				const err = new Error("Баллы за заказ не начислены")
				err.userError = true
				err.sersviceInfo = `Промокод ${this.promocode} не найден. Начисление баллов заказ`
				throw err
			}

			// получение товаров, на которые распространяется скидка;
			const discountedProducts = this.products.filter(async ({ product }) => (await ProductModel.isDiscounted(product?.toString() || '')))
			const discountedVariants = this.variants.filter(async ({ product }) => (await ProductModel.isDiscounted(product?.toString() || '')))
			
			// вычисление кэшбэка - 10% от суммы акционных товаров;
			const productsCashback = discountedProducts.reduce((cashback, { price }) => cashback + price, 0)
			const cashBack = discountedVariants.reduce((cashback, { price }) => cashback + price, productsCashback) * 0.1

			// начисление кэшбэка хранителю промокода;
			const promocodeHolderClient = await ClientModel.findById(promocode.holderClient)
			if ( promocodeHolderClient ) {
				await promocodeHolderClient.addCashback(cashBack)
			}
			
			// сохранение информации о заказе в объект промокода;
			const promocodeDoc = await PromocodeModel.findById(this.promocode.toString())
			if ( promocodeDoc ) {
				promocodeDoc.orders.push({ cashBack, orderId: this._id.toString() })
				await promocodeDoc.save()
			}
		}
		// заказ совершен без промокода;
		else {
			// начисление клиенту накопительной скидки;
			client.commonOrders.push(this._id)
			await client.save()
		}
	}
	catch (e) { throw e }
}

OrderSchema.methods.getNotRatedGoods = async function (this: IOrder): Promise<{ productId?: Types.ObjectId; variantId?: Types.ObjectId }[]> {
	try {
		const client = this.client
		const products = this.products.filter(async (item) => {
			const product = await ProductModel.findById(item.product)
			if (product) {
				return await product.isRatedByClient(client)
			}
		}).map(({ product }) => ({ productId: product }))
		const variants = this.variants.filter(async (item) => {
			const product = await ProductModel.findById(item.product)
			if (product) {
				return await product.isRatedByClient(client, item.variant)
			}
		}).map(({ product, variant }) => ({ productId: product, variantId: variant }))

		return [...products, ...variants]
	} catch (e) {
		throw e
	}
}

const Order = model<IOrder, OrderModel>('Order', OrderSchema)
export default Order