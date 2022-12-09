import { logger } from './../handlers/errorLogger';
import bodyParser, { json } from "body-parser";
import { Request, Router } from "express";
import { access, mkdir, readdir, rm } from "fs/promises";
import { Types } from "mongoose";
import multer, { diskStorage } from "multer";
import path from "path";
import ProductModel from "../models/ProductModel";

const router = Router()

const storage = diskStorage({
	destination: async (req, file, cb) => {
		const { id } = req.params
		const dirPath = path.join(__dirname, "static", "img", id)
		try {
			await access(dirPath)
			const files = await readdir(dirPath)
			for (const i in files) {
				const file = files[i]
				try {
					await rm(path.join(dirPath, file), { recursive: true })
				} catch (e) {
					console.log(e)
				}
			}
		} catch {
			try {
				await mkdir(dirPath, { recursive: true })
			} catch (e) {
				console.log(e)
				throw e
			}
		}
		cb(null, dirPath)
	},
	filename: (req, file, cb) => {
		const filename = Date.now() + path.extname(file.originalname)
		cb(null, filename)
	},
})

const upload = multer({ storage })

// получить товар;
router.get('/:id', async (req: Request<{id: string}>, res) => {
    try {
		const { id } = req.params
		const product = await ProductModel.getProduct(id)
		if (!product) {
			return res.status(500).json({ message: "Товар не найден" })
		}

		return res.json(product)
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// получить модификацию;
router.get('/variant/:id', async (req: Request<{id: string}, {}, {}, {productId: string}>, res) => {
    try {
		const { id } = req.params
		const { productId } = req.query
		const product = await ProductModel.getProduct(productId)
		if (!product) {
			return res.status(500).json({ message: "Товар не найден" })
		}

		const variant = product.variants.find(item => item.id === id)
		if (!variant) {
			return res.status(500).json({ message: "Вариант не найден" })
		}

		return res.json(variant)
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// установить фото товара;
router.put('/photo/:id', upload.single('photo'), async (req: Request<{id: string}>, res) => {
    try {
		const { id } = req.params
		const product = await ProductModel.findById(id)
		if (!product) {
			return res.status(500).json({ message: "Товар не найден" })
		}

		if (req.file) {
			product.photo.push(`/static/img/${id}/${req.file.filename}`)
			await product.save()
		}

		return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// новую сортировку фотографий товара или модификации;
router.put('/set-photo-order/:productId', json(), async (req: Request<{ productId: string }, {}, { photo: string[], variantId?: string }>, res) => {
	try {
		const { productId } = req.params
		const product = await ProductModel.findById(productId)
		if ( !product ) {
			return res.end()
		}

		const { photo, variantId } = req.body
		if ( variantId ) {
			await product.sortVariantPhotoOrdering(photo, variantId)
		} else {
			await product.sortProductPhotoOrdering(photo)
		}

		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// удалить фото товара;
router.delete('/photo/:id', async (req: Request<{id: string}>, res) => {
    try {
		const { id } = req.params
		const product = await ProductModel.findById(id)
		if (!product) {
			return res.status(500).json({ message: "Товар не найден" })
		}

		const dirPath = path.join(__dirname, "static", "img", id)
		try {
			const imgDir = await readdir(dirPath)
			for (const i in imgDir) {
				const file = path.join(dirPath, imgDir[i])
				await rm(file)
			}
		} catch (e) {
			console.log(e)
		}

		product.photo = []
		await product.save()

		return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// установить описание товара;
router.put('/description/:id', bodyParser.json(), async (req: Request<{id: string}, {}, {description: string}>, res) => {
    try {
		const { id } = req.params
		const { description } = req.body
		const product = await ProductModel.findById(id)
		if (!product) {
			return res.status(500).json({ message: "Товар не найден" })
		}

		product.description = description
		await product.save()
		return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

// установить фильтр;
router.put(
	"/filter/:id",
	bodyParser.json(),
	async (req: Request<{ id: string }, {}, { fieldId: string }>, res) => {
		try {
			const { id } = req.params
			const { fieldId } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.setFilter(new Types.ObjectId(fieldId))
			return res.end()
		} catch (e: any) {
			logger.error(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

// сбросить фильтр;
router.delete(
	"/filter/:id",
	bodyParser.json(),
	async (req: Request<{ id: string }, {}, { fieldId: string }>, res) => {
		try {
			const { id } = req.params
			const { fieldId } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.resetFilter(new Types.ObjectId(fieldId))
			return res.end()
		} catch (e: any) {
			logger.error(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

export default router