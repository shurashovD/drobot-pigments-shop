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

CompareSchema.methods.clearGoods = async function (this: ICompareDoc, categoryId: Types.ObjectId | string): Promise<void> {
	try {
        interface IGood { product: IProduct, variantId: Types.ObjectId }

        function fromCategory(value: IGood): value is IGood {
			return value.product.parentCategory?.toString() === categoryId.toString()
		}

		await this.populate<{ goods: IGood[] }>({
            path: 'goods', populate: 'product'
        }).then(doc => {
            const ids = doc.goods.filter(fromCategory).map(({ product }) => (product._id.toString()))
            const filterGoods = this.goods.filter(({ product }) => !ids.includes(product._id.toString()))
            this.goods = filterGoods as ICompareDoc['goods']
        }).then(() => this.save())
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

CompareSchema.methods.getProductsByCategory = async function (this: ICompareDoc, categoryId: Types.ObjectId | string): Promise<ICompareReport> {
	try {
		const category = await CategoryModel.findById(categoryId)
		const products = await ProductModel.find({ _id: { $in: this.goods.map(({ product }) => product) }, parentCategory: categoryId })
		const nonFiltereGoods = this.goods.map<Product | undefined>((item) => {
			const product = products.find(({ _id }) => _id.toString() === item.product.toString())
			const id = product?._id?.toString()
			if (item.variantId && product) {
				const variant = product.variants.find(({ _id }: any) => _id?.toString() === item.variantId?.toString())
				if (variant) {
					const { name, price, photo, _id } = variant
					if (photo.length) {
						return { ...variant.toObject(), name, price, photo, id, variantId: _id?.toString() }
					} else {
						return { ...variant.toObject(), name, price, id, variantId: _id?.toString() }
					}
				}
			}
			if (product) {
				return { ...product.toObject(), id }
			}
		})

		function notEmpty<Product>(value: Product | null | undefined): value is Product {
			return value !== null && value !== undefined
		}

        const goods = nonFiltereGoods.filter(notEmpty)

        const fields: ICompareReport["fields"] = category?.filters.map(({ _id, fields, title }) => {
			const id = _id.toString()
			const values: ICompareReport["fields"][0]["values"] = goods
                .map(({ id }) => fields.find(({ products }) => products.some((item) => item.toString() === id))?.value)
			return { id, title, values }
		}) || []

		return { fields, goods }
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