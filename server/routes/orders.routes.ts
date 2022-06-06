import bodyParser from 'body-parser';
import { Request, Router } from "express";
import { Schema } from "mongoose";
import { IOrder } from '../../shared';
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

router.get("/cart-total", async (req: Request<{}, {}, {}, { products: string }>, res) => {
	try {
		const products: { productId: string, quantity: number }[] = JSON.parse(req.query.products)
		const ids = products.map(({ productId }) => productId)
		const prices = await ProductModel.find<{ _id: Schema.Types.ObjectId, price: number | undefined }>({ _id: { $in: ids } }).select('price')
		if ( !prices ) {
			return res.status(500).json({ message: 'Не удалось посчитать сумму заказа' })
		}

		const total = prices.reduce((total, {_id, price}) => {
			const quantity = products.find(({ productId }) => productId === _id?.toString())?.quantity || 0
			return total + (price || 0) * quantity
		}, 0)
		return res.json(total)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get("/:id", async (req: Request<{id: string}>, res) => {
	try {
		const { id } = req.params
		const order: any = await OrderModel.findById(id)
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
		if (order.status === "new") {
			await OrderModel.findByIdAndUpdate(id, { status: "isReading" })
		}

		return res.json(order)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post(
	"/",
	bodyParser.json(),
	async (
		req: Request<
			{},
			{},
			{ tel: string; address: string; products: string }
		>,
		res
	) => {
		try {
			const { address, products, tel } = req.body
			let client = await ClientModel.findOne({ tel })
			if (!client) {
				client = await new ClientModel({ addresses: [address], tel }).save()
			}
			if ( !client.addresses.some(item => item === address) ) {
				client.addresses.push(address)
				await client.save()
			}

			const orderProducts = []
			let total = 0
			const productsArr = JSON.parse(products)
			for (const i in productsArr) {
				try {
					const { productId, quantity } = productsArr[i]
					const product = await ProductModel.findById(productId)
					if ( product ) {
						orderProducts.push({
							product: product._id,
							quantity,
						})
						total += product.price || 0
					}
				}
				catch (e) {
					console.log(e)
				}
			}

			const lastOrder = await OrderModel.find().sort({ number: -1 }).then(doc => doc?.[0])
			const number = (lastOrder?.number || 0) + 1
			const order = await new OrderModel({
				client: client._id,
				delivery: { address },
				products: orderProducts,
				number,
				total
			}).save()

			client.orders.push(order._id)
			await client.save()

			return res.json(number)
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Что-то пошло не так..." })
		}
	}
)

router.put("/", async (req, res) => {
	try {
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router