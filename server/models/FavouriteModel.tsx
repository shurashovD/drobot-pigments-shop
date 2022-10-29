import { model, Model, Schema, Types } from "mongoose";
import { IFavouriteDoc } from "../../shared";

const FavouriteSchema = new Schema<IFavouriteDoc, Model<IFavouriteDoc>>({
    goods: [{
        product: { type: Types.ObjectId, ref: "Product" },
        variantId: String
    }]
})

FavouriteSchema.methods.addGood = async function (
	this: IFavouriteDoc,
	productId: Types.ObjectId | string,
	variantId?: Types.ObjectId | string
): Promise<void> {
	try {
		const inFavourite = this.goods.some((item) => {
			const productMatch = item.product.toString() === productId.toString()
			if (!productMatch) {
				return false
			}
			const notVariant = !variantId && !item.variantId
			if (notVariant) {
				return true
			}
			return variantId?.toString() === item.variantId?.toString()
		})
		if (inFavourite) return

		const good: IFavouriteDoc['goods'][0] = { product: new Types.ObjectId(productId) }
		if (variantId) {
			good.variantId = variantId.toString()
		}
		this.goods.push(good)
		await this.save()
	} catch (e) {
		throw e
	}
}

FavouriteSchema.methods.rmGood = async function (this: IFavouriteDoc, productId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<void> {
	try {
		if (variantId) {
			const index = this.goods.findIndex(
				(item) => item.product.toString() === productId.toString() && !!item.variantId && item.variantId.toString() === variantId.toString()
			)
			if (index !== -1) {
				this.goods.splice(index, 1)
			}
		} else {
			const index = this.goods.findIndex((item) => item.product.toString() === productId.toString() && !item.variantId)
			if (index !== -1) {
				this.goods.splice(index, 1)
			}
		}
		await this.save()
	} catch (e) {
		throw e
	}
}

export default model('Favourite', FavouriteSchema)