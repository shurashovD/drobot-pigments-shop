import { model, Model, Schema, Types } from "mongoose";
import { ICompareDoc, ICompareMethods, ICompareReport, IProduct, Product } from "../../shared";
import CategoryModel from "./CategoryModel";
import ProductModel from "./ProductModel";

const CompareSchema = new Schema<ICompareDoc, Model<ICompareDoc, {}, ICompareMethods>>({
    goods: [{
        product: { type: Types.ObjectId, ref: 'Product' },
        variantId: Types.ObjectId
    }]
})

CompareSchema.methods.addGood = async function (this: ICompareDoc, productId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<void> {
    try {
        const inCompare = this.goods.some(item => {
            const matchProduct = item.product.toString() === productId.toString()
            if ( matchProduct ) {
                if ( variantId ) {
                    return item.variantId?.toString() === variantId.toString()
                } else {
                    return true
                }
            }
        })
        if ( inCompare ) {
            return
        }
        const good: { product: Types.ObjectId, variantId?: Types.ObjectId } = { product: new Types.ObjectId(productId) }
        if ( variantId ) {
            good.variantId = new Types.ObjectId(variantId)
        }
        this.goods.push(good)
        await this.save()
    } catch (e) {
        throw e
    }
}

CompareSchema.methods.compare = async function (this: ICompareDoc, firstGoodId: Types.ObjectId | string, secondGoodId: Types.ObjectId | string): Promise<ICompareReport> {
	try {
        const firstGood = this.goods.find(({ _id }) => (_id?.toString() === firstGoodId.toString()))
        const secondGood = this.goods.find(({ _id }) => _id?.toString() === secondGoodId.toString())
        const firstProduct = await ProductModel.findById(firstGood?.product)
		const secondProduct = await ProductModel.findById(secondGood?.product)

        if ( !firstProduct || !secondProduct ) {
            return { fields: [], goods: [] }
        }

        const category = await CategoryModel.findById(firstProduct.parentCategory)
        if ( !category ) {
            return { fields: [], goods: [] }
        }

        const fields: ICompareReport['fields'] = category.filters.map(({ fields, title, _id }) => {
            const id = _id?.toString()
            const first = fields.find(({ products }) => (products.some(item => item.toString() === firstGoodId.toString())))?.value
            const second = fields.find(({ products }) => products.some((item) => item.toString() === secondGoodId.toString()))?.value
            const values = [first, second]
            return { id, title, values }
        })

        const goods: ICompareReport["goods"] = [firstProduct, secondProduct].map<ICompareReport["goods"][0]>((item) => {
            const productId = item._id.toString()
			const variantId = this.goods.find(({ product }) => product.toString() === item._id.toString())?.variantId?.toString()
			if (variantId) {
				const variant = item.variants.find(({ _id }) => _id?.toString() === variantId)
				if (variant) {
					const { name, price, photo = '/static' } = variant
                    return { name, productId, price, photo, variantId }
				}
			}
			return { photo: item.photo[0], price: item.price || 0, productId, name: item.name }
		})

        return { fields, goods }
	} catch (e) {
		throw e
	}
}

CompareSchema.methods.getCategories = async function (this: ICompareDoc): Promise<{ id: string, title: string, length: number }[]> {
	try {
        const comparePop = await this.populate<{ goods: { product: IProduct; variantId?: Types.ObjectId }[] }>({ path: "goods", populate: "product" })
		const categoriesIds = comparePop.goods.reduce<string[]>((acc, { product }: { product: IProduct; variantId?: Types.ObjectId }) => {
            if (product.parentCategory && !acc.includes(product.parentCategory.toString())) {
                acc.push(product.parentCategory.toString())
            }
            return acc
        }, [])

        const categories = await CategoryModel.find({ _id: { $in: categoriesIds } })
        return categories.reduce<{ id: string; title: string; length: number }[]>((acc, item) => {
            const { id, title } = item
            const length = comparePop.goods.filter(
				({ product }: { product: IProduct; variantId?: Types.ObjectId }) => product.parentCategory?.toString() === id
			).length
            acc.push({ id, title, length })
            return acc
        }, [])
	} catch (e) {
		throw e
	}
}

CompareSchema.methods.getProductsByCategory = async function (this: ICompareDoc, categoryId: Types.ObjectId | string): Promise<Product[]> {
	try {
        const goods = await ProductModel.find({ _id: { $in: this.goods.map(({ product }) => (product)) }, parentCategory: categoryId })
        const products = this.goods.map<Product|undefined>((item) => {
            const product = goods.find(({ _id }) => (_id.toString() === item.product.toString()))
            if ( item.variantId && product ) {
                const variant = product.variants.find(({ _id }: any) => _id?.toString() === item.variantId)
				if (variant) {
					const { name, price, photo } = variant
					if (photo) {
						return { ...product.toObject(), name, price, photo: [photo] }
					} else {
						return { ...product.toObject(), name, price }
					}
				}
            }
            if ( product ) {
                return { ...product.toObject() }
            }
        })

        function notEmpty<Product>(value: Product | null | undefined): value is Product {
			return value !== null && value !== undefined
		}

        return products.filter(notEmpty)
	} catch (e) {
		throw e
	}
}

CompareSchema.methods.rmGood = async function (this: ICompareDoc, goodId: Types.ObjectId | string): Promise<void> {
	try {
        const index = this.goods.findIndex(({ _id }) => (_id?.toString() === goodId.toString()))
        if ( index !== -1 ) {
            this.goods.splice(index, 1)
            await this.save()
        }
	} catch (e) {
		throw e
	}
}

export default model('Compare', CompareSchema)