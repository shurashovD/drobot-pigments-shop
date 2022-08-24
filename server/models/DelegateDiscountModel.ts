import { IDelegateDiscountDoc } from "../../shared"
import { model, Model, Schema } from "mongoose";

const DelegateDiscountSchema = new Schema<IDelegateDiscountDoc, Model<IDelegateDiscountDoc>>({
	lowerTreshold: { type: Number, required: true, unique: true },
	percentValue: { type: Number, required: true }
})

export default model("DelegateDiscount", DelegateDiscountSchema)