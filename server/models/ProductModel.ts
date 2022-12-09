import { IProduct, IProductMethods, IProductModel, Product } from './../../shared/index.d';
import { model, Schema, Types } from 'mongoose';
import CurrencyModel from './CurrencyModel';
import UomModel from './UomModel';
import CategoryModel from './CategoryModel';
import config from 'config'
import RaitingModel from './RatingModel';
import { logger } from '../handlers/errorLogger';

const discountRootCategory = config.get("discountRootCategory")

const VariantSchema = new Schema<IProduct["variants"][0]>({
	identifier: String,
	name: String,
	photo: [String],
	images: [
		{
			filename: String,
			miniature: String,
			updated: String,
		},
	],
	price: Number,
	reviewsCount: Number,
	value: String,
	rating: Number,
})

export const VariantModel = model("Variant", VariantSchema)

const ProductSchema = new Schema<IProduct, IProductModel, IProductMethods>({
	archived: { type: Boolean, default: false },
	available: { type: Number, default: 0 },
	currency: { type: Schema.Types.ObjectId, ref: "Currency" },
	description: String,
	identifier: { type: String, required: true },
	images: [{
		filename: String,
		miniature: String,
		updated: String
	}],
	name: { type: String, required: true },
	parent: { type: Schema.Types.ObjectId, ref: "Catalog" },
	parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
	photo: [String],
	properties: [Schema.Types.ObjectId],
	price: { type: Number },
	uom: { type: Schema.Types.ObjectId, ref: "Uom" },
	rating: Number,
	reviewsCount: Number,
	variantsLabel: String,
	variants: [VariantSchema],
	weight: { type: Number },
})

ProductSchema.statics.getProduct = async function(id: string): Promise<Product | null> {
	try {
		const product = await this.findById(id).populate<{currency: string, uom: string}>([
			{ path: "currency", model: CurrencyModel, select: "name" },
			{ path: "uom", model: UomModel, select: "name" },
		])

		if ( !product ) return null

		const variants: Product['variants'] = product.variants?.map(item => ({ 
			...item.toObject(), 
			id: item._id?.toString() || ''
		})) || []

		const result: Product = {
			archived: product.archived,
			available: product.available,
			category: product.parentCategory?.toString(),
			currency: product.currency,
			description: product.description,
			id: product._id.toString(),
			name: product.name,
			photo: product.photo,
			price: product.price,
			properties: product.properties.map((item) => item.toString()),
			uom: product.uom,
			variants
		}
		if ( product.variantsLabel ) {
			result.variantsLabel = product.variantsLabel
		}
		return result
	}
	catch (e) { throw e }
}

ProductSchema.statics.isDiscounted = async function (id: string): Promise<boolean> {
	try {
		async function getRootCategoryId(categoryId: Types.ObjectId): Promise<Types.ObjectId|undefined> {
			try {
				const category = await CategoryModel.findById(categoryId)
				if (category?.parentCategory) {
					return await getRootCategoryId(category.parentCategory)
				}
				return categoryId
			} catch (e) {}
		}

		if ( !discountRootCategory ) {
			return false
		}

		const product = await this.findById(id)
		if ( !product?.parentCategory ) {
			return false
		}

		const rootCategoryId = await getRootCategoryId(product.parentCategory)
		return rootCategoryId === discountRootCategory
	} catch (e) {
		console.log(e)
		logger.error(e)
		return false
	}
}

ProductSchema.methods.setFilter = async function(fieldId: Types.ObjectId): Promise<IProduct> {
	try {
		const category = await CategoryModel.findById(this.parentCategory)
		if ( !category ) {
			const error = new Error("Категория товара не найдена")
			error.userError = true
			throw error
		}

		const filterIndex = category.filters.findIndex(({ fields }) => fields.some(({ _id }) => _id?.toString() === fieldId.toString()))
		if (filterIndex === -1) {
			const error = new Error(
				"Категория не содержит фильтра с таким значением"
			)
			error.userError = true
			throw error
		}
		const fieldIndex = category.filters[filterIndex].fields.findIndex(({ _id }) => _id?.toString() === fieldId.toString())
		const productInField = category.filters[filterIndex].fields[fieldIndex].products.some(item => item.toString() === this._id.toString())
		if ( !productInField ) {
			category.filters[filterIndex].fields[fieldIndex].products.push(this._id)
			await category.save()
		}
		
		const productHasProperty = this.properties.some((item: Types.ObjectId) => item.toString() === fieldId.toString())
		if ( !productHasProperty ) {
			this.properties.push(fieldId)
		}

		return await this.save()
	}
	catch (e) { throw e }
}

ProductSchema.methods.resetFilter = async function(this: IProduct, fieldId: Types.ObjectId): Promise<IProduct> {
	try {
		const category = await CategoryModel.findById(this.parentCategory)
		if ( !category ) {
			const error = new Error("Категория товара не найдена")
			error.userError = true
			throw error
		}

		const filterIndex = category.filters.findIndex(({ fields }) => fields.some(({ _id }) => _id?.toString() === fieldId.toString()))
		if (filterIndex === -1) {
			return this
		}
		const fieldIndex = category.filters[filterIndex].fields.findIndex(({ _id }) => _id?.toString() === fieldId.toString())
		const productIndex = category.filters[filterIndex].fields[fieldIndex].products.findIndex(item => item.toString() === this._id.toString())
		if (productIndex !== -1) {
			category.filters[filterIndex].fields[fieldIndex].products.splice(productIndex, 1)
			await category.save()
		}
		
		const propertyIndex = this.properties.findIndex((item: Types.ObjectId) => item.toString() === fieldId.toString())
		if (propertyIndex !== -1) {
			this.properties.splice(propertyIndex, 1)
		}

		return await this.save()
	}
	catch (e) { throw e }
}

ProductSchema.methods.refreshRating = async function (this: IProduct, variantId?: Types.ObjectId | string): Promise<void> {
	try {
		const ratings = await RaitingModel.find({ productId: this._id, variantId })

		const reviewsCount = ratings.reduce((sum, { text }) => sum + +(!!text), 0)
		let rating = ratings.reduce((sum, { rating }) => sum + rating, 0) / Math.max(ratings.length, 1)
		rating = +(Math.round(10 * rating) / 10).toFixed(1)

		if ( rating ) {
			if ( variantId ) {
				const variant = this.variants.find(({ _id }) => _id?.toString() === variantId)
				if ( !variant ) {
					const err = new Error('Модификация не найдена')
					err.userError = true
					err.sersviceInfo = "Обновление оценки модификации"
					throw err
				}
				variant.rating = rating
				variant.reviewsCount = reviewsCount
			} else {
				this.rating = rating
				this.reviewsCount = reviewsCount
			}
			await this.save()
		}
	} catch (e) {
		throw e
	}
}

ProductSchema.methods.isRatedByClient = async function (this: IProduct, clientId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<boolean> {
	try {
		return await RaitingModel.find({ productId: this._id, variantId, clientId }).then(doc => !!doc)
	} catch (e) {
		throw e
	}
}

ProductSchema.methods.sortProductPhotoOrdering = async function(this: IProduct, photo: string[]): Promise<void> {
	try {
		this.photo = photo
		await this.save()
	} catch (e) {
		throw e
	}
}

ProductSchema.methods.sortVariantPhotoOrdering = async function (this: IProduct, photo: string[], variantId: string): Promise<void> {
	try {
		const variant = this.variants.find(({ _id }) => _id?.toString() === variantId)
		if ( variant ) {
			variant.photo = photo
		}
		await this.save()
	} catch (e) {
		throw e
	}
}

export default model<IProduct, IProductModel>("Product", ProductSchema)