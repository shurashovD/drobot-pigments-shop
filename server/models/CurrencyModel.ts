import { ICurrency } from '../../shared';
import { model, Model, Schema } from "mongoose";

const CurrencySchema = new Schema<ICurrency, Model<ICurrency>>({
	fullName: { type: String, required: true },
	identifier: { type: String, required: true },
	isoCode: { type: String, required: true },
	name: { type: String, required: true }
})

export default model('Currency', CurrencySchema)