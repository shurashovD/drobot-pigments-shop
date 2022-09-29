import { IClient, IOrder, IPromocode, IPromocodeDetails, IPromocodeDoc, IPromocodeMethods } from '../../shared';
import { Model, model, Schema } from "mongoose";

interface IPromocodeModel extends Model<IPromocodeDoc, {}, IPromocodeMethods> {
	getPromocode: (id: string) => Promise<IPromocode>
	getDiscountPercentValue: (id: string) => Promise<number | undefined>
	check: (args: { id?: string; code?: string }) => Promise<"valid" | "invalid" | "expired">
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
	promocodeTotalCashBack: { type: Number, default: 0 },
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
			const promocode = await PromocodeModel.findOne({ _id: id, dateStart: { $lte: Date.now() }, dateFinish: { $gte: Date.now() } })
			if ( promocode?.status === 'stopped' ) {
				return "invalid"
			}
			return !!promocode ? "valid" : "invalid"
		}
		if ( code ) {
			const promocode = await PromocodeModel.findOne({ code })
			if ( promocode ) {
				if (promocode.status === "stopped") {
					return "invalid"
				}
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

		const promocode = await PromocodeModel.findById(id)
		if ( !promocode ) {
			return 
		}

		return promocode.discountPercent

	} catch (e) {
		throw e
	}
}

PromocodeSchema.methods.getDetails = async function(this: IPromocodeDoc): Promise<IPromocodeDetails> {
	try {
		return await this.populate<{ orders: { cashBack: number; orderId: Omit<IOrder, "client"> & { client: IClient } }[] }>({
			path: "orders",
			populate: {
				path: "orderId",
				populate: { path: "client" },
			},
		}).then((doc) => {
			const { code, dateFinish, dateStart, _id, status, promocodeTotalCashBack, orders } = doc
			const ordersRes = orders.map<IPromocodeDetails["orders"][0]>(
				({ cashBack: orderCashBack, orderId }: { cashBack: number; orderId: Omit<IOrder, "client"> & { client: IClient } }) => {
					const { client, total: orderTotal, _id, number } = orderId
					return {
						buyer: client.name || "Неизвестный покупатель",
						orderCashBack, orderTotal,
						orderId: _id?.toString() || "",
						orderNumber: number?.toString(),
					}
				}
			)
			const ordersTotal = orders.reduce(
				(sum, { orderId }: { cashBack: number; orderId: Omit<IOrder, "client"> & { client: IClient } }) => orderId.total + sum, 0
			)
			const total: IPromocodeDetails["total"] = {
				ordersLength: orders.length,
				ordersTotal,
				totalCashBack: promocodeTotalCashBack,
			}
			return { code, dateFinish, dateStart, id: _id.toString(), status, total, orders: ordersRes }
		})
	} catch(e) {
		console.log(e)
		throw e
	}
}

const PromocodeModel = model<IPromocodeDoc, IPromocodeModel>("Promocode", PromocodeSchema)

export default PromocodeModel