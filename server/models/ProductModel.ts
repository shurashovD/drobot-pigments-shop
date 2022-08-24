import { IProduct, IProductMethods, IProductModel, Product } from './../../shared/index.d';
import { model, Schema, Types } from 'mongoose';
import CurrencyModel from './CurrencyModel';
import UomModel from './UomModel';
import CategoryModel from './CategoryModel';
import config from 'config'

const discountRootCategory = config.get("discountRootCategory")

const VariantSchema = new Schema<IProduct["variants"][0]>({
	identifier: String,
	name: String,
	photo: String,
	photoUpdate: String,
	price: Number,
	value: String
})

export const VariantModel = model("Variant", VariantSchema)

const ProductSchema = new Schema<IProduct, IProductModel, IProductMethods>({
	archived: { type: Boolean, default: false },
	available: { type: Number, default: 0 },
	currency: { type: Schema.Types.ObjectId, ref: "Currency" },
	description: String,
	identifier: { type: String, required: true },
	name: { type: String, required: true },
	parent: { type: Schema.Types.ObjectId, ref: "Catalog" },
	parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
	photo: [String],
	photoUpdated: String,
	properties: [Schema.Types.ObjectId],
	price: { type: Number },
	uom: { type: Schema.Types.ObjectId, ref: "Uom" },
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
		const product = await this.findById(id)
		return product?.parentCategory?.toString() === discountRootCategory
	} catch (e) {
		console.log(e)
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

ProductSchema.methods.resetFilter = async function(fieldId: Types.ObjectId): Promise<IProduct> {
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
/*
ProductSchema.methods.createBind = async function(this: IProduct, bindTitle: string, productLabel: string): Promise<IProduct> {
	try {
		if ( this.parentBind.length > 0 ) {
			const error = new Error("Связанный товар не может содержать связь")
			error.userError = true
			throw error
		}

		const productHasBind = this.binds.some(({ title }) => title === bindTitle)
		if ( productHasBind ) {
			const error = new Error('Товар уже содержит связь с таким названием')
			error.userError = true
			throw error
		}

		this.binds.push(new bindModel({ products: [], productLabel, title: bindTitle }))
		return await this.save()
	}
	catch (e) { throw e }
}

ProductSchema.methods.updateBind = async function(this: IProduct, bindId: string, bindTitle: string, productLabel: string): Promise<IProduct> {
	try {
		const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
		if ( bindIndex === -1 ) {
			const error = new Error("Связь не найдена")
			error.userError = true
			throw error
		}

		this.binds[bindIndex].title = bindTitle
		this.binds[bindIndex].productLabel = productLabel
		return await this.save()
	}
	catch (e) { throw e }
}

ProductSchema.methods.deleteBind = async function(this: IProduct, bindId: string): Promise<IProduct> {
	try {
		const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
		if ( bindIndex === -1 ) {
			const error = new Error("Связь не найдена")
			error.userError = true
			throw error
		}

		if (this.binds[bindIndex].products.length > 0) {
			const error = new Error("Сначала отвяжите все товары")
			error.userError = true
			throw error
		}

		this.binds.splice(bindIndex, 1)
		return await this.save()
	}
	catch (e) { throw e }
}

ProductSchema.methods.bindProduct = async function(this: IProduct, bindId: string, bindLabel: string, productId: string): Promise<IProduct> {
	try {
		if ( this.parentBind.length > 0 ) {
			const error = new Error("Связанный товар не может содержать связь")
			error.userError = true
			throw error
		}
		const product: IProduct | null = await model('Product').findById(productId)
		if ( !product ) {
			const error = new Error("Товар для связи не найден")
			error.userError = true
			throw error
		}
		const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
		if ( bindIndex === -1 ) {
			const error = new Error("Связь не найдена")
			error.userError = true
			throw error
		}

		const productExistsParentBind = product.parentBind.some(item => item.toString() === this._id?.toString())
		if ( !productExistsParentBind ) {
			product.parentBind.push(this._id)
			await product.save()
		}

		const productIsBinded = this.binds.some(({ products }) =>
			products.some(({ product }) => product.toString() === productId)
		)
		if ( !productIsBinded ) {
			this.binds[bindIndex].products.push({
				label: bindLabel,
				product: product._id,
			})
		}

		return await this.save()
	}
	catch (e) { throw e }
}

ProductSchema.methods.reBindProduct = async function(this: IProduct, bindId: string, productId: string): Promise<IProduct> {
	try {
		const product: IProduct | null = await model('Product').findById(productId)
		if ( !product ) {
			const error = new Error("Связанный товар не найден")
			error.userError = true
			throw error
		}

		const parentBindIndex = product.parentBind.findIndex(item => item.toString() === this._id.toString())
		if ( parentBindIndex !== -1 ) {
			product.parentBind.splice(parentBindIndex, 1)
			await product.save()
		}

		const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
		if ( bindIndex === -1 ) {
			const error = new Error("Связь не найдена")
			error.userError = true
			throw error
		}

		const bindProductIndex = this.binds[bindIndex].products.findIndex(({ product }) => product.toString() === productId)
		if ( bindProductIndex !== -1 ) {
			this.binds[bindIndex].products.splice(bindProductIndex, 1)
		}

		return await this.save()
	}
	catch (e) { throw e }
}
*/
export default model<IProduct, IProductModel>("Product", ProductSchema)