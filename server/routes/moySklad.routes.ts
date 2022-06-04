import { Request, Router } from "express";
import { Types } from "mongoose";
import ProductModel from "../models/ProductModel";
import CatalogModel from "../models/CatalogModel";
import { currencySync, productFolderSync, productSync, uomSync } from "../moyskladAPI/synchronization"

const router = Router()

router.get("/folder", async (req, res) => {
	try {
		const catalogs = await CatalogModel.find({
			archived: false,
			parent: { $exists: false },
		})
		const products = await ProductModel.find({
			archived: false,
			parent: { $exists: false },
		})
		return res.json({ catalogs, products })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get("/folder-free-products", async (req, res) => {
	try {
		const catalogs = await CatalogModel.find({
			archived: false,
			parent: { $exists: false },
		})
		const products = await ProductModel.find({
			archived: false,
			parent: { $exists: false },
		})
		return res.json({ catalogs, products })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get('/folder-free-products/:id', async (req: Request<{id: string}, {}, {}>, res) => {
    try {
        const { id } = req.params
		const catalog = await CatalogModel.findById(id)
		if (!catalog) {
			return res.status(500).json({ message: 'Папка не найдена в БД "Мой склад"' })
		}

        const catalogs = await CatalogModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
		})
        const products = await ProductModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
			parentCategory: { $exists: false }
		})
		return res.json({ catalog, catalogs, products })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Что-то пошло не так..." })
    }
})


router.get("/folder/:id", async (req: Request<{ id: string }, {}, {}>, res) => {
	try {
		const { id } = req.params
		const catalog = await CatalogModel.findById(id)
		if (!catalog) {
			return res
				.status(500)
				.json({ message: 'Папка не найдена в БД "Мой склад"' })
		}

		const catalogs = await CatalogModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
		})
		const products = await ProductModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
		})
		return res.json({ catalog, catalogs, products })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get('/sync', async (req, res) => {
    try {
        await currencySync()
        await uomSync()
        await productFolderSync()
        await productSync()
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

export default router