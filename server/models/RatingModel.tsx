import { model, Model, Schema, Types } from 'mongoose'
import { IRating, IRatingStatics } from '../../shared'
import ProductModel from './ProductModel'

interface IRatingModel extends Model<IRating>, IRatingStatics {}

const RatingSchema = new Schema<IRating, IRatingModel>({
	clientId: { type: Types.ObjectId, ref: "Client" },
	date: { type: Date, default: new Date() },
	deliveryRating: Number,
    moderated: { type: Boolean, default: true },
	productId: { type: Types.ObjectId, ref: "Product" },
	rating: Number,
	text: String,
	variantId: Types.ObjectId,
})

RatingSchema.virtual('id').get(function() {
    return this._id.toString()
})

RatingSchema.statics.createRating = async function (
	productId: Types.ObjectId | string,
	rating: number,
	variantId?: Types.ObjectId | string,
	deliveryRating?: number,
	text?: string,
	clientId?: Types.ObjectId | string
): Promise<void> {
	try {
		await new this({ clientId, deliveryRating, productId, rating, text, variantId }).save()
        const product = await ProductModel.findById(productId)
        if ( !product ) {
            const err = new Error('Товар не найден')
            err.userError = true
            err.sersviceInfo = "Создание оценки товара"
            throw err
        }
        await product.refreshRating()
	} catch (e) {
		throw e
	}
}

export default model<IRating, IRatingModel>("Rating", RatingSchema)