import { IOrder, IOrderPop, OrderModel } from './../../shared/index.d';
import { model, Schema } from "mongoose";

const OrderSchema = new Schema<IOrder, OrderModel>({
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
	},
	payment: {
		paymentId: String,
		status: String,
		probably: Boolean,
	},
	products: [
		{
			product: { type: Schema.Types.ObjectId, ref: "Product" },
			quantity: { type: Number, required: true },
			price: Number,
			discountOn: Number,
		},
	],
	variants: [
		{
			product: { type: Schema.Types.ObjectId, ref: "Product" },
			variant: { type: Schema.Types.ObjectId, ref: "Variant" },
			quantity: { type: Number, required: true },
			price: Number,
			discountOn: Number
		},
	],
	msOrderId: String,
	msOrderSumRub: Number,
	number: { type: Number, default: 1 },
	status: { type: String, default: "new" },
	total: Number,
})

OrderSchema.statics.getOrder = async (id: string) => {
	try {
		const order = await Order.findById(id).populate<{ products: IOrderPop["products"][0][]; variants: IOrderPop["variants"][0][] }>([
			{ path: "client" },
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

const Order = model<IOrder, OrderModel>('Order', OrderSchema)

export default Order