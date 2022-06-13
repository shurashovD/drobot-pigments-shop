import { Model, Schema, model } from 'mongoose';
import { IReqId } from '../../shared';

const ReqIdSchema = new Schema<IReqId, Model<IReqId>>({
    requestId: String
})

export const ReqIdModel = model('ReqId', ReqIdSchema)