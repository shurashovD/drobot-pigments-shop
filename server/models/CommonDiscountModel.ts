import { ICommonDiscountDoc } from "./../../shared/index.d"
import { model, Model, Schema } from "mongoose";

const CommonDiscountSchema = new Schema<ICommonDiscountDoc, Model<ICommonDiscountDoc>>({
	lowerTreshold: { type: Number, required: true, unique: true },
	percentValue: { type: Number, required: true }
})

export default model("CommonDiscount", CommonDiscountSchema)