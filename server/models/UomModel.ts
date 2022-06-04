import { IUom } from '../../shared';
import { model, Model, Schema } from "mongoose";

const UomSchema = new Schema<IUom, Model<IUom>>({
	description: { type: String },
	identifier: { type: String, required: true },
	name: { type: String, required: true }
})

export default model('Uom', UomSchema)