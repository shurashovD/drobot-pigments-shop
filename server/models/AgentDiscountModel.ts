import { IAgentDiscountDoc } from "../../shared"
import { model, Model, Schema } from "mongoose";

const AgentDiscountSchema = new Schema<IAgentDiscountDoc, Model<IAgentDiscountDoc>>({
	percentValue: { type: Number, required: true }
})

export default model("AgentDiscount", AgentDiscountSchema)