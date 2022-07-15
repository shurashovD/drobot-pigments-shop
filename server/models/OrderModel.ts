import { IOrder } from './../../shared/index.d';
import { model, Model, Schema } from "mongoose";

const OrderSchema = new Schema<IOrder, Model<IOrder>>({
	client: { type: Schema.Types.ObjectId, ref: "Client" },
	date: { type: Date, default: Date.now },
	delivery: {
		sdek: {
			uuid: String,
			cost: Number
		},
	},
	payment: {
		paymentId: String,
		status: String,
		probably: Boolean
	},
	products: [
		{
			product: { type: Schema.Types.ObjectId, ref: "Product" },
			quantity: { type: Number, required: true },
		},
	],
	variants: [
		{
			product: { type: Schema.Types.ObjectId, ref: "Product" },
			variant: { type: Schema.Types.ObjectId, ref: "Variant" },
			quantity: { type: Number, required: true },
		},
	],
	msOrderId: String,
	number: { type: Number, default: 1 },
	status: { type: String, default: "new" },
	total: Number,
})

export default model('Order', OrderSchema)