import bodyParser from "body-parser";
import { Request, Router } from "express";
import { access, mkdir, readdir, rm } from "fs/promises";
import multer, { diskStorage } from "multer";
import path from "path";
import { ICategory, IProduct } from "../../shared";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";

const router = Router()

const storage = diskStorage({
    destination: async (req, file, cb) => {
        const { id } = req.params
        const dirPath = path.join(__dirname, 'static', 'img', id)
        try {
            await access(dirPath)
            const files = await readdir(dirPath)
            for ( const i in files ) {
                const file = files[i]
                try {
                    await rm(path.join(dirPath, file), { recursive: true })
                }
                catch (e) {
                    console.log(e)
                }
            }
        }
        catch {
            try {
                await mkdir(dirPath, { recursive: true })
            }
            catch (e) {
                console.log(e)
                throw e
            }
        }
        cb(null, dirPath)
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname)
        cb(null, filename)
    }
})

const upload = multer({ storage })

// получение всех категорий;
router.get("/", async (req, res) => {
	try {
        const categories = await CategoryModel.find({ archived: false })
        return res.json(categories)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// получение отдельной категории;
router.get("/:id", async (req: Request<{id: string}>, res) => {
	try {
        const { id } = req.params
		const category = await CategoryModel.findById(id)
        if ( !category ) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }
        const variantsFilter = await CategoryModel.findById(id)
			.populate<{ products: IProduct[] }>({ path: "products", model: ProductModel })
			.then((doc) => {
                if ( !doc ) return doc
				return doc.products.reduce<ICategory["variantsFilter"]>((res, { variants, variantsLabel }) => {
                    if ( !variants || !variantsLabel || !res ) return res
                    const index = res.findIndex(item => item.variantsLabel === variantsLabel)
                    const variantsValues = variants.map(({ value }) => value)
                    if ( index === -1 ) {
                        res.push({ variantsLabel, variantsValues })
                    } else {
                        res[index].variantsValues = Array.from(new Set(res[index].variantsValues.concat(variantsValues)))
                    }
                    return res
                }, [])
			})

        const prices = await CategoryModel.findById(id)
			.populate<{ products: IProduct[] }>({ path: "products", model: ProductModel })
			.then((doc) => {
				if (!doc) return doc
				return doc.products.reduce<number[]>((res, { variants, price }) => {
					if (!variants && !price) return res
                    if (!variants && price) return res.concat(price)
					return res.concat(variants.map(({ price }) => price || 0))
				}, []).filter(item => item > 0).map(item => item / 100).sort((a, b) => a - b)
			})
        if ( prices && prices?.length > 1 ) {
            return res.json({ ...category.toObject(), variantsFilter, minPrice: prices[0], maxPrice: prices[prices.length - 1] })
        }
		return res.json({ ...category.toObject(), variantsFilter })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// получение товаров категории;
router.get("/products/:id", async (req: Request<{ id: string }, {}, {},
    {filters?: string, limit?: number, page?: number, sortByPrice?: boolean}>, res) => {
	try {
        const { filters, limit, page, sortByPrice } = req.query
		const { id } = req.params
		const category = await CategoryModel.findById(id).populate({ path: 'products', model: ProductModel })
		if (!category) {
			return res.status(500).json({ message: "Категория не найдена" })
		}
        const products = category.getProducts(filters ? JSON.parse(filters) : undefined, limit, page, sortByPrice)
		return res.json(products)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// получение товаров и модификаций категории;
router.get(
	"/products-and-variants/:id",
	async (
		req: Request<
			{ id: string },
			{},
			{},
			{ filters?: string; limit?: number; page?: number; sortByPrice?: boolean; variantsFilter?: string; minPrice?: number; maxPrice?: number }
		>,
		res
	) => {
		try {
			const { filters: filtersJSON, limit, page, sortByPrice, variantsFilter: variantsFilterJSON, minPrice, maxPrice } = req.query
			let filters, variantsFilter
			try {
				if (filtersJSON) {
					filters = JSON.parse(filtersJSON)
				}
			} catch {}
			try {
				if (variantsFilterJSON) {
					variantsFilter = JSON.parse(variantsFilterJSON)
				}
			} catch {}

			const { id } = req.params
			const category = await CategoryModel.findById(id).populate({ path: "products", model: ProductModel })
			if (!category) {
				return res.status(500).json({ message: "Категория не найдена" })
			}
			const products = category.getProductsAndVariants({ filters, limit, page, variantsFilter, sortByPrice, minPrice, maxPrice })
			return res.json(products)
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Что-то пошло не так..." })
		}
	}
)

// добавление товаров в категорию;
router.post('/products/:id', bodyParser.json(), async (req: Request<{id: string}, {}, {products: string []}>, res) => {
    try {
		const { id } = req.params
		const { products } = req.body
		const category = await CategoryModel.findById(id)
		if (!category) {
			return res.status(500).json({ message: "Категория не найдена" })
		}

        for ( const productId of products ) {
            await category.addProduct(productId)
        }
		return res.end()
	} catch (e: any) {
		console.log(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// удаление товара из категории;
router.delete('/products/:id', bodyParser.json(), async (req: Request<{id: string}, {}, {productId: string}>, res) => {
    try {
		const { id } = req.params
		const { productId } = req.body
		const category = await CategoryModel.findById(id)
		if (!category) {
			return res.status(500).json({ message: "Категория не найдена" })
		}

        await category.rmProduct(productId)
		return res.end()
	} catch (e: any) {
		console.log(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// создание категории;
router.post("/", bodyParser.json(), async (req: Request<{}, {}, {title: string}>, res) => {
	try {
        const { title } = req.body
		await CategoryModel.create({ title })
		return res.end()
	} catch (e: any) {
        if (e.code === 11000) {
            return res.status(500).json({ message: "Категория с таким именем уже существует" })
        }
        console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// изменение название и описания категории;
router.put("/:id", bodyParser.json(), async (req: Request<{id: string}, {}, {description: string, title: string}>, res) => {
	try {
        const { id } = req.params
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json('Категория не найдена')
        }

        const { description, title } = req.body
        category.description = description
        category.title = title

		await category.save()
		return res.end()
	} catch (e: any) {
		if (e.code === 11000) {
			return res
				.status(500)
				.json({ message: "Категория с таким именем уже существует" })
		}
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// удаление категории;
router.delete("/:id", bodyParser.json(), async (req: Request<{id: string}, {}, {}>, res) => {
	try {
        const { id } = req.params
        await CategoryModel.findByIdAndUpdate(id, { archived: true })
		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// добавление фотографии категории;
router.put("/photo/:id", upload.single('photo'), async (req: Request<{id: string}, {}, {}>, res) => {
	try {
        const { id } = req.params
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json('Категория не найдена')
        }

        const filename = req.file?.filename
        if ( filename ) {
            category.photo = [`/static/img/${id}/${filename}`]
        }
		await category.save()
		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// удаление фотографии категории;
router.delete("/photo/:id", async (req: Request<{id: string}, {}, {}>, res) => {
	try {
        const { id } = req.params
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json('Категория не найдена')
        }
        const dirPath = path.join(__dirname, 'static', 'img', id)
        try {
            const imgDir = await readdir(dirPath)
			for (const i in imgDir) {
				const file = path.join(dirPath, imgDir[i])
				await rm(file)
			}
        }
        catch (e) {
            console.log(e)
        }
        category.photo = []
		await category.save()
		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// создание фильтра категории;
router.post('/filter/:id', bodyParser.json(),async (req: Request<{id: string}, {}, {title: string}>, res) => {
    try {
        const { id } = req.params
        const { title } = req.body
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }

        await category.addFilter(title)
        return res.end()
    }
    catch (e: any) {
        console.log(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

// изменение названия фильтра категории;
router.put("/filter/:id", bodyParser.json(), async (req: Request<{id: string}, {}, {filterId: string, title: string}>, res) => {
    try {
        const { id } = req.params
        const { filterId, title } = req.body
        const category = await CategoryModel.findById(id)
        if ( !category ) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }

        await category.updFilter(filterId, title)
        return res.end()
    }
    catch (e: any) {
        console.log(e)
        const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

// удаление фильтра категории;
router.delete('/filter/:id', bodyParser.json(), async (req: Request<{id: string}, {}, {filterId: string}>, res) => {
    try {
        const { id } = req.params
        const { filterId } = req.body
        const category = await CategoryModel.findById(id)
        if ( !category ) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }

        await category.rmFilter(filterId)
        return res.end()
    }
    catch (e: any) {
        console.log(e)
        const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

// добавление значения фильтра;
router.post('/filter/value/:id', bodyParser.json(), async (req: Request<{id: string}, {}, {filterId: string, value: string}>, res) => {
    try {
        const { id } = req.params
        const { filterId, value } = req.body
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }

        await category.addField(filterId, value)
        return res.end()
    }
    catch (e: any) {
        console.log(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

// изменение названия значения фильтра;
router.put('/filter/value/:id', bodyParser.json(),
    async (req: Request<{id: string}, {}, {filterId: string, fieldId: string, value: string}>, res) => {
    try {
        const { id } = req.params
        const { filterId, fieldId, value } = req.body
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }

        await category.updField(filterId, fieldId, value)
        return res.end()
    }
    catch (e: any) {
        console.log(e)
        const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

// удаление значения фильтра;
router.delete('/filter/value/:id', bodyParser.json(),
    async (req: Request<{id: string}, {}, {filterId: string, fieldId: string}>, res) => {
    try {
        const { id } = req.params
        const { filterId, fieldId } = req.body
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' })
        }

        await category.rmField(filterId, fieldId)
        return res.end()
    }
    catch (e: any) {
        console.log(e)
        const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

export default router