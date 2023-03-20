import { model, Model, Schema } from "mongoose";
import { ISdekCitiesDoc } from "../../shared";

const SdekCitiesSchema = new Schema<ISdekCitiesDoc, Model<ISdekCitiesDoc>>({
    city: String,
    code: Number,
    country: String,
    country_code: String,
    region: String
})

export const SdekCitiesModel = model('SdekCity', SdekCitiesSchema)