import { Request, Router } from "express";
import ClientModel from "../models/ClientModel";
import OrderModel from "../models/OrderModel";
import ProductModel from '../models/ProductModel'

const formatter = Intl.DateTimeFormat('ru', {
	day: 'numeric',
	month: 'short',
	year: '2-digit',
	hour: 'numeric',
	minute: '2-digit'
})

const router = Router()

router.get('/', async (req, res) => {
    try {
        const orders = await OrderModel.find().populate([
			{ path: "client", model: ClientModel },
			{ path: "products", populate: { path: 'product', model: ProductModel } },
		]).then(doc => doc.map((item) => {
			const date = formatter.format(Date.parse(item.date.toString()))
			return { ...item.toObject(), date }
		}))
        return res.json(orders)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get("/:id", async (req: Request<{id: string}>, res) => {
	try {
		const { id } = req.params
		const order = await OrderModel.findById(id)
			.populate([
				{ path: "client", model: ClientModel },
				{
					path: "products",
					populate: { path: "product", model: ProductModel },
				},
			])
			.then((doc) => {
				if ( !doc ) return doc
				const date = formatter.format(
						Date.parse(doc.date.toString())
					)
				return { ...doc.toObject(), date }
			})
		if (!order) {
			return res.status(500).json({ message: 'Завка не найдена' })
		}

		return res.json(order)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post("/", async (req, res) => {
	try {
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.put("/", async (req, res) => {
	try {
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router