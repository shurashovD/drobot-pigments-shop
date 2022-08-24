import { IPromocode, IPromocodeDoc } from '../../shared';
import { Model, model, Schema } from "mongoose";

interface IPromocodeModel extends Model<IPromocodeDoc> {
	getPromocode: (id: string) => Promise<IPromocode>
	getDiscountPercentValue: (id: string) => Promise<number | undefined>
	check: (args: {id?: string, code?: string}) => Promise<"valid" | "invalid" | "expired">
}

const PromocodeSchema = new Schema<IPromocodeDoc, IPromocodeModel>({
	code: { type: String, required: true, unique: true },
	dateStart: { type: Date, required: true },
	dateFinish: { type: Date, required: true },
	discountPercent: { type: Number, default: 5 },
	holderClient: { type: Schema.Types.ObjectId, ref: "Client" },
	orders: [
		{
			cashBack: Number,
			orderId: { type: Schema.Types.ObjectId, ref: "Order" },
		},
	],
	promocodeTotalCashBack: Number,
	status: String
})

PromocodeSchema.statics.getPromocode = async (id: string) => {
	try {
		const promocode = await PromocodeModel.findById(id).populate([{ path: 'holderClient' }, { path: 'orders', populate: { path: 'orderId' } }])
			.then(doc => {
				if (!doc) {
					return doc
				}

				const { code, dateFinish, dateStart, discountPercent, holderClient, promocodeTotalCashBack, status } = doc
				const id = doc._id.toString()
				const orders = doc.orders.map(({ cashBack, orderId }) => ({ cashBack, orderId: orderId.toString() }))
				return { code, dateStart, dateFinish, discountPercent, holderClient, id, promocodeTotalCashBack, status, orders }
			})

		return promocode
	} catch (e) {
		throw e
	}
}

PromocodeSchema.statics.check = async function (args: { id?: string; code?: string }): Promise<"valid" | "invalid" | "expired"> {
	try {
		const { code, id } = args
		if ( id ) {
			const promocode = await PromocodeModel.findOne({ _id: id, dateStart: { $gte: Date.now() }, dateFinish: { $lte: Date.now() } })
			return !!promocode ? "valid" : "invalid"
		}
		if ( code ) {
			const promocode = await PromocodeModel.findOne({ code })
			if ( promocode ) {
				if ( (Date.now() >= Date.parse(promocode.dateStart.toString())) && (Date.now() <= Date.parse(promocode.dateFinish.toString())) ) {
					return "valid"
				}
				return "expired"
			}
		}
		return "invalid"
	} catch (e) {
		throw e
	}
}

PromocodeSchema.statics.getDiscountPercentValue = async (id: string) => {
	try {
		const check = await PromocodeModel.check({ id })
		if ( check !== 'valid' ) {
			return
		}

		const promocode = await PromocodeModel.findOne()
		if ( !promocode ) {
			return 
		}

		return promocode.discountPercent

	} catch (e) {
		throw e
	}
}

const PromocodeModel = model<IPromocodeDoc, IPromocodeModel>("Promocode", PromocodeSchema)

export default PromocodeModel