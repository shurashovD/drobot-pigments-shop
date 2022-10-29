import { Model, model, Schema } from "mongoose";
import { IAmoContact } from "../../shared";

const AmoContactSchema = new Schema<IAmoContact, Model<IAmoContact>>({
    amoContactId: { type: String, unique: true },
    number: Number
})

export default model('AmoContact', AmoContactSchema)