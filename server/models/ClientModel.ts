import { IClient } from '../../shared';
import { model, Model, Schema, Types } from 'mongoose'

const ClientSchema = new Schema<IClient, Model<IClient>>({
    addresses: [String],
    amoContactId: Number,
    counterpartyId: String,
    mail: String,
    name: String,
    orders: [{ type: Types.ObjectId, ref: 'Order' }],
    tel: { type: String, required: true }
})

export default model('Client', ClientSchema)