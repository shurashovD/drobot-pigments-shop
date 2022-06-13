import { CategoryModel, ICategory, Product, IFilter, IProduct, ICategoryMethods } from './../../shared/index.d';
import { model, Schema, Types } from 'mongoose'
import ProductModel from './ProductModel'

const FilterSchema = new Schema<IFilter>({
    fields: [{
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        value: { type: String, required: true }
    }],
    title: { type: String, required: true }
})

const filterModel = model('Filter', FilterSchema)

const CategorySchema = new Schema<ICategory, CategoryModel, ICategoryMethods>({
    archived: { type: Boolean, default: false },
    description: String,
    filters: [FilterSchema],
    frontEndKey: String,
    photo: [String],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    title: { type: String, required: true, unique: true}
})

// получить товары в категории;
CategorySchema.methods.getProducts = function(filters: string[][] = [], limit?: number, page?: number, sortByPrice?: boolean): { length: number, products: Product[] } {
    let result = this.products as any[]
    for (const i in filters) {
        const filter = filters[i]
		result = result.filter(({ properties }) =>
			properties.some((prop: Types.ObjectId) => filter.some((item) => item === prop.toString()))
		)
	}
    result = result
		.map((item) => {
			const variants = item.variants.map((variant: IProduct["variants"][0]) => ({
				...variant.toObject(),
				id: variant._id?.toString(),
			}))
			return { ...item.toObject(), id: item._id.toString(), variants }
		})
    const { length } = result
    if (sortByPrice) {
		result = result.sort((a, b) => {
			if (!(a.price && b.price)) {
				return 1
			}
			return a.price - b.price
		})
	}
    if ( limit && page ) {
        const start = limit * (page - 1)
		const end = limit * page
        return { length, products: result.slice(start, end) }
    }
    return { length, products: result }
}

// добавить фильтр в категорию;
CategorySchema.methods.addFilter = async function(title: string): Promise<ICategory> {
    try {
        if ( !this.filters.some((item: IFilter) => item.title === title) ) {
            const filter = new filterModel({ title })
            this.filters.push(filter)
        }
        return await this.save()
    }
    catch (e) { throw e }
}

// удалить фильтр из категории;
CategorySchema.methods.rmFilter = async function(filterId: string): Promise<ICategory> {
    try {
        const filters = this.filters as IFilter[]
        const index = filters.findIndex(({_id}) => _id.toString() === filterId)
        if ( index === -1 ) {
            throw new Error('Фильтр не найден').userError = true
        }
        const filterIsUsed = filters[index].fields.some(({ products }) => products.length > 0)
        if (filterIsUsed) {
            throw new Error('Есть продукты, использующие этот фильтр, фильтр не удалён').userError = true
        }
        this.filters.splice(index, 1)
        return await this.save()
    }
    catch (e) { throw e }
}

// изменить название фильтра;
CategorySchema.methods.updFilter = async function(filterId: string, title: string): Promise<ICategory> {
    try {
        const filters = this.filters as IFilter[]
        const index = filters.findIndex(({_id}) => _id.toString() === filterId)
        if ( index === -1 ) {
            const error = new Error(`Фильтр не найден`)
			error.userError = true
			throw error
        }
        this.filters[index].title = title
        return await this.save()
    }
    catch (e) { throw e }
}

// добавить значение фильтра;
CategorySchema.methods.addField = async function(filterId: string, value: string): Promise<ICategory> {
    try {
        const filters = this.filters as IFilter[]
        const index = filters.findIndex(({_id}) => _id.toString() === filterId)
        if ( index === -1 ) {
            const error = new Error(`Фильтр не найден`)
            error.userError = true
            throw error
        }
        const fieldExists = filters[index].fields.some(item => item.value.toLowerCase() === value.toLowerCase())
        if ( fieldExists ) {
            const error = new Error(`Критерий с названием ${value} уже существует в фильтре ${filters[index].title}`)
            error.userError = true
            throw error
        }
        this.filters[index].fields.push({ products: [], value })
        return await this.save()
    }
    catch (e) { throw e }
}

// сменить название значения фильтра;
CategorySchema.methods.updField = async function(filterId: string, fieldId: string, value: string): Promise<ICategory> {
    try {
        const filters = this.filters as IFilter[]
        const index = filters.findIndex(({_id}) => _id.toString() === filterId)
        if ( index === -1 ) {
            const error = new Error(`Фильтр не найден`)
			error.userError = true
			throw error
        }
        const fieldIndex = filters[index].fields.findIndex(({ _id }) => _id?.toString() === fieldId)
        if (fieldIndex === -1) {
            const error = new Error(`Поле не найдено`)
			error.userError = true
			throw error
		}
        this.filters[index].fields[fieldIndex].value = value
        return await this.save()
    }
    catch (e) { throw e }
}

// удаление значения фильтра;
CategorySchema.methods.rmField = async function (filterId: string, fieldId: string): Promise<ICategory> {
	try {
		const filters = this.filters as IFilter[]
		const index = filters.findIndex(
			({ _id }) => _id.toString() === filterId
		)
		if (index === -1) {
			const error = new Error(`Фильтр не найден`)
			error.userError = true
			throw error
		}
		const fieldIndex = filters[index].fields.findIndex(
			({ _id }) => _id?.toString() === fieldId
		)
		if (fieldIndex === -1) {
			const error = new Error(`Поле не найдено`)
			error.userError = true
			throw error
		}
		const fieldIsUsed = filters[index].fields[fieldIndex].products.length > 0
		if (fieldIsUsed) {
            const error = new Error(
				`Есть продукты, использующие этот критерий, критерий не удалён`
			)
			error.userError = true
			throw error
		}
		this.filters[index].fields.splice(fieldIndex, 1)
		return await this.save()
	} catch (e) {
		throw e
	}
}

// добавление товара в категорию;
CategorySchema.methods.addProduct = async function (productId: string): Promise<ICategory> {
    try {
        const product = await ProductModel.findById(productId)
        if ( !product ) {
            const error = new Error(`Товар не найден`)
			error.userError = true
			throw error
        }
        if (product.parentCategory) {
            const error = new Error(`Товар находится в другой категории`)
			error.userError = true
			throw error
		}
        product.parentCategory = this._id
        await product.save()
        this.products.push(product._id)
        return await this.save()
    }
    catch (e) { throw e }
}

// удаление товара из категории;
CategorySchema.methods.rmProduct = async function (productId: string): Promise<ICategory> {
    try {
        const product = await ProductModel.findById(productId)
        if ( !product ) {
            const error = new Error(`Товар не найден`)
			error.userError = true
			throw error
        }
        if (product.parentCategory?.toString() !== this._id.toString()) {
            const error = new Error(`Товар не из этой категории`)
			error.userError = true
			throw error
		}
        if (product.properties.length > 0) {
            const error = new Error(
				`Сначала удалите все значения фильтров товара`
			)
			error.userError = true
			throw error
        }

        await ProductModel.findByIdAndUpdate(productId, {
			$unset: { parentCategory: true },
		})
        const products = this.products as Types.ObjectId[]
        const index = products.findIndex(item => item.toString() === productId)
        if ( index !== -1 ) {
            this.products.splice(index, 1)
        }
        return await this.save()
    }
    catch (e) { throw e }
}

export default model<ICategory, CategoryModel>("Category", CategorySchema)