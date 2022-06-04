import bodyParser from "body-parser";
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
		console.log(e)
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
		console.log(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
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
		console.log(e)
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
		console.log(e)
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
			console.log(e)
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
			console.log(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

// создать связь;
router.post(
	"/bind/:id",
	bodyParser.json(),
	async (req: Request<{ id: string }, {}, { bindTitle: string, productLabel: string }>, res) => {
		try {
			const { id } = req.params
			const { bindTitle, productLabel } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.createBind(bindTitle, productLabel)
			return res.end()
		} catch (e: any) {
			console.log(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

// изменить название связи;
router.put(
	"/bind/:id",
	bodyParser.json(),
	async (
		req: Request<{ id: string }, {}, { bindId: string; bindTitle: string, productLabel: string }>,
		res
	) => {
		try {
			const { id } = req.params
			const { bindId, bindTitle, productLabel } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.updateBind(bindId, bindTitle, productLabel)
			return res.end()
		} catch (e: any) {
			console.log(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

// удалить связь;
router.delete(
	"/bind/:id",
	bodyParser.json(),
	async (req: Request<{ id: string }, {}, { bindId: string }>, res) => {
		try {
			const { id } = req.params
			const { bindId } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.deleteBind(bindId)
			return res.end()
		} catch (e: any) {
			console.log(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

// привязать товар;
router.put(
	"/bind-product/:id",
	bodyParser.json(),
	async (
		req: Request<{ id: string }, {}, { bindId: string; bindLabel: string; productId: string }>,
		res
	) => {
		try {
			const { id } = req.params
			const { bindId, bindLabel, productId } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.bindProduct(bindId, bindLabel, productId)
			return res.end()
		} catch (e: any) {
			console.log(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

// отвязать товар;
router.delete(
	"/bind-product/:id",
	bodyParser.json(),
	async (
		req: Request<{ id: string }, {}, { bindId: string; productId: string }>,
		res
	) => {
		try {
			const { id } = req.params
			const { bindId, productId } = req.body
			const product = await ProductModel.findById(id)
			if (!product) {
				return res.status(500).json({ message: "Товар не найден" })
			}

			await product.reBindProduct(bindId, productId)
			return res.end()
		} catch (e: any) {
			console.log(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

export default router