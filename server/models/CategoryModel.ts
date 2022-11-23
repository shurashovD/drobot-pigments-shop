import { CategoryModel, ICategory, Product, IFilter, IProduct, ICategoryMethods, ICategorySiteProduct } from './../../shared/index.d';
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
        if ( filter.length === 0 ) continue
		result = result.filter(({ properties }) => {
            return properties.some((prop: Types.ObjectId) => filter.some((item) => item === prop.toString()))
        })
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

// получить товары и модификации в категории;
CategorySchema.methods.getProductsAndVariants = function (
	this: ICategory,
	args: {
		filters: string[][]
		limit?: number
		page?: number
		variantsFilter?: string[]
		sortByPrice?: boolean
		minPrice?: number
		maxPrice?: number
	}
): { length: number; products: ICategorySiteProduct[]; filtersFieldsLength: { fieldId: string; productsLength: number }[] } {
	const { filters = [], limit, page, sortByPrice, variantsFilter, minPrice, maxPrice } = args

	function getFilteredProducts(products: IProduct[], filters: string[][]): IProduct[] {
		let result = products
		for (const i in filters) {
			const filter = filters[i]
			if (filter.length === 0) continue
			result = result.filter(({ properties }) => {
				return properties.some((prop: Types.ObjectId) => filter.includes(prop.toString()))
			})
		}
		return result
	}

	function normalizedProducts(products: IProduct[]): ICategorySiteProduct[] {
		return products.reduce<ICategorySiteProduct[]>((res, item) => {
			if (item.variants.length) {
				const arr = item.variants.map((el: any) => {
					const res: ICategorySiteProduct = {
						price: (el.price || 0) / 100,
						productId: item._id.toString(),
						productTitle: item.name,
						img: el.photo,
						variantId: el._id.toString(),
						variantTitle: el.name,
						variantValue: el.value,
					}
					return res
				})
				return [...res, ...arr]
			} else {
				const element: ICategorySiteProduct = {
					price: (item.price || 0) / 100,
					productId: item._id.toString(),
					productTitle: item.name,
					img: item.photo[0],
				}
				return [...res, element]
			}
		}, [])
	}

	function filterByPrice(products: ICategorySiteProduct[], minPrice?: number, maxPrice?: number): ICategorySiteProduct[] {
		if (minPrice && maxPrice) {
			return products.filter(({ price }) => price >= minPrice && price <= maxPrice)
		}
		return products
	}

	function filterByVariants(products: ICategorySiteProduct[], variantsFilter?: string[]): ICategorySiteProduct[] {
		if (variantsFilter && variantsFilter.length > 0) {
			return products.filter((item) => variantsFilter.includes(item.variantValue || ""))
		}
		return products
	}

	function priceSort(products: ICategorySiteProduct[], sortByPrice?: boolean): ICategorySiteProduct[] {
		if (sortByPrice) {
			return products.sort((a, b) => {
				if (!(a.price && b.price)) {
					return 1
				}
				return a.price - b.price
			})
		}
		return products
	}

	function trimByPage(products: ICategorySiteProduct[], limit?: number, page?: number): ICategorySiteProduct[] {
		if (limit && page) {
			const start = limit * (page - 1)
			const end = limit * page
			return products.slice(start, end)
		}
		return products
	}

	function addFieldInFilters(filter: IFilter, fieldId: string, filters?: string[][]): string[][] {
		if (!filters) {
			return [[fieldId]].filter((item) => item.length)
		}
		const filterFieldsIds = filter.fields.map<string>(({ _id }) => _id?.toString() || "")
		const index = filters.findIndex((item) => item.some((el) => filterFieldsIds.includes(el)))
		if (index === -1) {
			return filters.concat([[fieldId]]).filter(item => item.length)
		} else {
			return filters.map((item, i) => {
				if (i === index) {
					return [fieldId]
				} else {
					return item
				}
			})
		}
	}

	const productsDoc = this.products as any[]
	const filteredProducts = getFilteredProducts(productsDoc, filters)
	const normalizeProducts = normalizedProducts(filteredProducts)
	const priceFilterProducts = filterByPrice(normalizeProducts, minPrice, maxPrice)
	const result = filterByVariants(priceFilterProducts, variantsFilter)
	const resultSortedByPrice = priceSort(result, sortByPrice)
	const products = trimByPage(resultSortedByPrice, limit, page)
	const { length } = result

	const filtersFieldsLength = this.filters.reduce<{ fieldId: string; productsLength: number }[]>((acc, filter) => {
		for (const i in filter.fields) {
			const field = filter.fields[i]
			const fieldId = field._id?.toString() || ""
			const newFilter = addFieldInFilters(filter, fieldId, filters)
			const productsLength = getFilteredProducts(productsDoc, newFilter).length
			acc.push({ productsLength, fieldId })
		}
		return acc
	}, [])

	return { filtersFieldsLength, length, products }
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