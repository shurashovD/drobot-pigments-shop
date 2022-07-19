import { model, Model, Schema } from "mongoose";
import { IAmoAuthCodeExchangeResponseDoc } from "../../shared";

const AmoCredSchema = new Schema<
	IAmoAuthCodeExchangeResponseDoc,
	Model<IAmoAuthCodeExchangeResponseDoc>
>({
	access_token: String,
	expires_in: Number,
	refresh_token: String,
	token_type: String,
})

export default model('AmoCred', AmoCredSchema)