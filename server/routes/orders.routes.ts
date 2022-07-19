import { IOrder } from './../../shared/index.d';
import { checkNumber, checkPin } from './../plusofonAPI/plusofonApi';
import bodyParser from 'body-parser';
import { Request, Router } from "express";
import { ISdekCalcPayload, ISdekOrderPayload } from '../../shared';
import ClientModel from "../models/ClientModel";
import OrderModel from "../models/OrderModel";
import PointsModel from '../models/PointsModel';
import ProductModel, { VariantModel } from '../models/ProductModel'
import createMsOrder, { updateMsOrder } from '../moyskladAPI/orders';
import rests from '../moyskladAPI/rests';
import { sdekCalcDelivery } from '../sdekAPI/calc';
import { getCity, getPointName } from '../sdekAPI/staticData';
import getCounterPartyByNumber from '../moyskladAPI/counterparty';
import { sdekCreateOrder } from '../sdekAPI/orders';
import { createUKPayment } from '../ukassaAPI/payments';
import { createContact } from '../amoAPI/amoApi';

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
			{ path: 'variants', populate: { path: 'variant', model: VariantModel } }
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

router.get('/cart', async (req, res) => {
	try {
		const cart = req.session.cart || { products: [], variants: [] }
		return res.json(cart)
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.get('/delivery/city', async (req, res) => {
	try {
		const city_code = req.session.delivery?.city_code
		if ( !city_code ) {
			return res.end()
		}

		const point = await PointsModel.findOne({ 'location.city_code': city_code })
		if ( !point ) {
			throw new Error(`Пункт выдачи в городе ${city_code} не найден`)
		}

		return res.json(`${point.location.region} ${point.location.city}`)
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.get("/delivery/detail", async (req, res) => {
	try {
		if ( req.session.delivery?.sdek && req.session.delivery?.city_code && req.session.cart ) {
			const { checked, tariff_code, address, code } = req.session.delivery.sdek
			const { city_code } = req.session.delivery
			const products = await ProductModel.find({ _id: { $in: req.session.cart.products.map(({ productId }) => productId) } })
			const variantProducts = await ProductModel.find({ _id: { $in: req.session.cart.variants.map(({ productId }) => productId) } })
			const packages: ISdekCalcPayload['packages'] = req.session.cart.products.map(({ productId, quantity }) => {
				const product = products.find(({ _id }) => _id?.toString() === productId)
				if ( product?.weight ) {
					const { weight } = product
					return { weight: weight * quantity }
				}
				return { weight: 25 * quantity }
			}).concat(
				req.session.cart.variants.map(({ productId, variantId, quantity }) => {
					const variant = variantProducts.find(({ _id }) => _id?.toString() === productId)
						?.variants.find(({ _id }) => _id?.toString() === variantId)
					return { weight: 25 * quantity }
				})
			)
			const sdekInfo = await sdekCalcDelivery({
				from_location: { code: 435 },
				to_location: { code: city_code },
				packages, tariff_code
			})
			const { delivery_sum, period_max, period_min, total_sum } = sdekInfo.data
			req.session.delivery.sdek.cost = total_sum
			if ( tariff_code === 139 ) {
				if ( req.session.delivery.sdek.address ) {
					return res.json({ sdek: checked, tariff_code, address, ...sdekInfo.data })
				} else {
					return res.json({ sdek: checked, tariff_code, ...sdekInfo.data })
				}
			} else {
				if (req.session.delivery.sdek.code) {
					const point = await PointsModel.findOne({ code })
					return res.json({ sdek: checked, tariff_code, code, address: point?.location.address, ...sdekInfo.data })
				} else {
					return res.json({ sdek: checked, tariff_code, ...sdekInfo.data })
				}
			}
		}
		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get("/delivery/recipient", async (req, res) => {
	try {
		const userId = req.session.userId
		if (!userId) {
			return res.end()
		}

		const client = await ClientModel.findById(userId)
		if (!client) {
			return res.end()
		}

		const result: { phone: string, name?: string, mail?: string } = { phone: client.tel }
		if ( req.session.delivery?.recipientName ) {
			result.name = req.session.delivery.recipientName
		}
		if (req.session.delivery?.recipientMail) {
			result.mail = req.session.delivery.recipientMail
		}

		return res.json(result)
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.put("/delivery/recipient", bodyParser.json(), async (req: Request<{}, {}, { name: string, mail: string }>, res) => {
	try {
		const userId = req.session.userId
		if (!userId) {
			return res.end()
		}

		const client = await ClientModel.findById(userId)
		if (!client) {
			return res.end()
		}

		const { name, mail } = req.body

		if ( !client.name && name !== '' ) {
			client.name = name
			await client.save()
		}

		if ( !client.mail && mail !== '' ) {
			client.mail = mail
			await client.save()
		}

		if ( name !== '' ) {
			if ( !req.session.delivery ) {
				req.session.delivery = {}
			}
			req.session.delivery.recipientName = name
		}

		if (mail !== "") {
			if (!req.session.delivery) {
				req.session.delivery = {}
			}
			req.session.delivery.recipientMail = mail
		}

		return res.end()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.put(
	"/cart/product",
	bodyParser.json(),
	async (req: Request<{}, {}, { productId: string; quantity: number }>, res) => {
		try {
			const { productId, quantity } = req.body
			const product = await ProductModel.findById(productId)
			if ( !product ) {
				throw new Error('Товар не найден')
			}
			
			const stock = await rests({ assortmentId: [product.identifier] }).then(doc => doc[0].stock)
			if (!stock) {
				throw new Error("Остаток не получен")
			}

			const cart = req.session.cart
			if (!cart && (stock * quantity > 0)) {
				req.session.cart = {
					products: [{ productId, quantity: Math.min(quantity, stock) }],
					variants: [],
				}
				return res.end()
			}

			if ( cart ) {
				const index = cart.products.findIndex(item => item.productId === productId)
				if (stock * quantity === 0) {
					if (index !== -1) {
						cart.products.splice(index, 1)
					}
				} else {
					if (index !== -1) {
						cart.products.push({
							productId,
							quantity: Math.min(quantity, stock)
						})
					} else {
						cart.products[index].quantity = Math.min(quantity, stock)
					}
				}
			}

			req.session.cart = cart
			return res.end()
			
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Что-то пошло не так..." })
		}
	}
)

router.put(
	"/cart/variant",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { productId: string; variantId: string, quantity: number }>,
		res
	) => {
		try {
			const { productId, variantId, quantity } = req.body
			const product = await ProductModel.findById(productId)
			if (!product) {
				throw new Error("Товар не найден")
			}

			const variant = product.variants.find(({ _id }) => _id?.toString())
			if (!variant) {
				throw new Error("Вариант не найден")
			}

			const stock = await rests({
				assortmentId: [variant.identifier],
			}).then((doc) => doc[0].stock)
			if (!stock) {
				throw new Error("Остаток не получен")
			}

			const cart = req.session.cart
			if (!cart && stock * quantity > 0) {
				req.session.cart = {
					products: [],
					variants: [
						{ productId, variantId, quantity: Math.min(quantity, stock) },
					],
				}
				return res.end()
			}

			if (cart) {
				const index = cart.variants.findIndex((item) => item.variantId === variantId)
				if (stock * quantity === 0) {
					if (index !== -1) {
						cart.variants.splice(index, 1)
					}
				} else {
					if (index !== -1) {
						cart.variants[index].quantity = Math.min(
							quantity,
							stock
						)
					} else {
						cart.variants.push({
							productId,
							variantId,
							quantity: Math.min(quantity, stock),
						})
					}
				}
			}

			req.session.cart = cart
			return res.end()
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Что-то пошло не так..." })
		}
	}
)

router.delete('/cart', async (req: Request<{}, {}, {}, { productIds: string, variantIds: string }>, res) => {
	try {
		const { productIds, variantIds } = req.query
		const products: string[] = JSON.parse(productIds)
		const variants: string[] = JSON.parse(variantIds)
		if ( req.session.cart?.products ) {
			req.session.cart.products = req.session.cart.products.filter(({ productId }) => !products.some(item => item === productId))
		}
		if (req.session.cart?.variants) {
			req.session.cart.variants = req.session.cart.variants.filter(
				({ variantId }) => !variants.some((item) => item === variantId)
			)
		}
		if ( products.length === 0 && variants.length === 0 ) {
			req.session.cart = { products: [], variants: [] }
		}
		return res.end()
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.get("/cart-total", async (req: Request<{}, {}, {}, { products: string, variants: string }>, res) => {
	try {
		if (!req.session.cart) {
			return res.json(0)
		}

		const products: string[] = JSON.parse(req.query.products)
		const variants: { productId: string, variantId: string}[] = JSON.parse(req.query.variants)
		const productsInDb = await ProductModel.find({_id: { $in: products }})
		const variantProducts = await ProductModel.find({ _id: { $in: variants.map(({ productId }) => productId) } })

		const variantsTotal = req.session.cart.variants
			.filter(({ variantId }) => variants.some((item) => item.variantId === variantId))
			.reduce((total, variant) => {
				const { productId, variantId, quantity } = variant
				const product = variantProducts.find(
					({ _id }) => _id?.toString() === productId
				)
				if (product) {
					const price =
						product.variants.find(
							({ _id }) => _id?.toString() === variantId
						)?.price || 0
					total += price * quantity
				}
				return total
			}, 0)

		const total = req.session.cart.products
			.filter(({ productId }) => products.some(item => item === productId))
			.reduce((total, { productId, quantity }) => {
				const product = productsInDb.find(({ _id }) => _id.toString() === productId)
				if ( !product ) {
					return total
				}
				return total + (product?.price || 0) * quantity
			}, variantsTotal)
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
				{
					path: "variants",
					populate: { path: "product", model: ProductModel },
				},
			])
			.then((doc) => {
				if (!doc) return doc
				const date = formatter.format(Date.parse(doc.date.toString()))
				const variants = doc.variants.map((item: any) => {
					const variant = item.product.variants.find(({ _id }: any) => _id?.toString() === item.variant.toString())
					return { ...item.toObject(), product: item.product._id, variant }
				})
				return { ...doc.toObject(), date, variants }
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

router.put('/set/city/:city_code', async (req: Request<{city_code: number}>, res) => {
	try {
		const { city_code } = req.params
		if ( !req.session.delivery ) {
			req.session.delivery = { city_code }
		} else {
			req.session.delivery.city_code = city_code
		}
		return res.end()
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.put(
	"/set/delivery",
	bodyParser.json(),
	async (
		req: Request<
			{},
			{},
			{ sdek: boolean, tariff_code: 138 | 139 | 366, address?: string, code?: string }
		>,
		res
	) => {
		try {
			if (!req.session.delivery?.city_code) {
				throw new Error(`Город доставки не определён`)
			}
			const { sdek, tariff_code, address, code } = req.body
			if ( sdek ) {
				req.session.delivery.sdek = {
					checked: true, tariff_code
				}
				if ( tariff_code === 139 && address ) {
					req.session.delivery.sdek.address = address
				}
				if ( tariff_code !== 139 && code ) {
					req.session.delivery.sdek.code = code
				}
			}
			return res.end()
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Что-то пошло не так..." })
		}
	}
)

router.post(
	"/",
	bodyParser.json(),
	async (
		req: Request<
			{},
			{},
			{ city_code: number, address?: string; code?: number; products: string, variants: string }
		>,
		res
	) => {
		try {
			const { products, variants } = req.body
			const client = await ClientModel.findById(req.session.userId)
			if ( !client ) {
				return res.status(500).json({ message: 'Не удалось привязать заказ...' })
			}

			if ( !req.session.cart ) {
				return res.status(500).json({ message: 'Корзина не найдена...' })
			}
			const orderProducts = []
			const orderVariants = []
			const positions: {
				quantity: number
				price: number
				productId?: string
				variantId?: string
			}[] = []
			let total = 0
			const productsFromClient: { productId: string, quantity: number }[] = JSON.parse(products)
			const productsArr = productsFromClient.filter(item => req.session.cart?.products.some(({ productId }) => productId === item.productId))
			for (const i in productsArr) {
				try {
					const { productId, quantity } = productsArr[i]
					const product = await ProductModel.findById(productId)
					if ( product ) {
						orderProducts.push({
							product: product._id,
							quantity,
						})
						positions.push({
							quantity,
							price: product.price || 0,
							productId: product.identifier
						})
						total += product.price || 0
					}
				}
				catch (e) {
					console.log(e)
				}
			}
			const variantsFromClient: { variantId: string, productId: string, quantity: number }[] = JSON.parse(variants)
			const variantsArr = variantsFromClient.filter((item) =>
				req.session.cart?.variants.some(
					({ variantId }) => variantId === item.variantId
				)
			)
			for (const i in variantsArr) {
				try {
					const { productId, quantity, variantId } = variantsArr[i]
					const product = await ProductModel.findById(productId)
					if (product) {
						const variant = product.variants.find(({ _id }) => _id?.toString() === variantId)
						if ( variant ) {
							orderVariants.push({
								product: product._id,
								variant: variant._id,
								quantity,
							})
							positions.push({
								quantity,
								price: variant.price || 0,
								variantId: variant.identifier,
							})
							total += variant.price || 0
						}
					}
				} catch (e) {
					console.log(e)
				}
			}


			if (!req.session.delivery) {
				throw new Error("Не найдены параметры доставки")
			}
			if ( !req.session.delivery.city_code ) {
				throw new Error('Не найден город доставки')
			}
			const { city_code, sdek } = req.session.delivery
			if (!sdek) {
				throw new Error("Не найдены параметры СДЭК")
			}
			const city = await getCity(city_code)
			const { tariff_code, address, code } = sdek
			let point
			if ( code ) {
				point = await getPointName(code)
			}

			const addressString = `До ${(tariff_code === 138) && 'ПВЗ'} ${(tariff_code === 139) && 'адреса'} ${(tariff_code === 366) && 'постамата'}, ${address}`
			const msOrder = await createMsOrder({ city, address, point, positions, counterpartyId: client.counterpartyId })

			const { name: number, id: msOrderId, shipmentAddress, sum } = msOrder
			const order = await new OrderModel({
				client: client._id,
				delivery: { address: addressString },
				products: orderProducts,
				variants: orderVariants,
				msOrderId, number,
				total: total / 100,
			}).save()

			client.orders.push(order._id)
			await client.save()

			req.session.cart.products = req.session.cart.products.filter(
				({ productId }) =>
					!productsFromClient.some(
						(item) => item.productId === productId
					)
			)
			req.session.cart.variants = req.session.cart.variants.filter(
				({ variantId }) =>
					!variantsFromClient.some(
						(item) => item.variantId === variantId
					)
			)

			const productItems = await ProductModel.find({ _id: { $in: productsArr.map(({ productId }) => productId) }})
			const variantItems = await ProductModel.find({ _id: { $in: variantsArr.map(({ productId }) => productId) }})
			const items: ISdekOrderPayload['packages'][0]['items'] = []
			for (const i in productsArr) {
				const { productId, quantity } = productsArr[i]
				const product = productItems.find(({ _id }) => _id.toString() === productId)
				if ( product ) {
					items.push({
						amount: quantity,
						cost: (product.price || 0) / 100,
						name: product.name,
						payment: { value: 0 },
						ware_key: product.identifier,
						weight: product.weight || 25 * quantity
					})
				}
			}
			for (const i in variantsArr) {
				const { productId, variantId, quantity } = variantsArr[i]
				const product = variantItems.find(
					({ _id }) => _id.toString() === productId
				)
				const variant = product?.variants.find(({ _id }) => _id?.toString() === variantId)
				if (variant) {
					items.push({
						amount: quantity,
						cost: (variant.price || 0) / 100,
						name: product?.name || '' + ' ' + variant.name,
						payment: { value: 0 },
						ware_key: variant.identifier,
						weight: product?.weight || 25 * quantity,
					})
				}
			}

			const sdekPayload: ISdekOrderPayload = {
				tariff_code,
				recipient: {
					name: client.name || "Покупатель",
					phones: [{ number: `+7${client.tel}` }],
					number: `+7${client.tel}`,
				},
				from_location: {
					address: "Дзержинского 87/1",
					code: 435,
				},
				packages: [
					{
						number,
						items,
						weight: items.reduce(
							(total, { weight }) => total + weight,
							0
						),
					},
				],
			}
			if ( tariff_code === 139 && address ) {
				sdekPayload.to_location = { address, code: req.session.delivery.city_code }
			}
			if ( tariff_code === 138 || tariff_code === 366 ) {
				sdekPayload.delivery_point = req.session.delivery.sdek?.code
			}
			const uuid = await sdekCreateOrder(sdekPayload)
			if (order.delivery.sdek) {
				order.delivery.sdek.uuid = uuid
				order.delivery.sdek.cost = req.session.delivery.sdek?.cost || 0
			} else {
				order.delivery = {
					sdek: {
						uuid,
						cost: req.session.delivery.sdek?.cost || 0,
					},
				}
			}
			await order.save()

			await updateMsOrder(msOrderId, {
				shipmentAddress: `${shipmentAddress}; СДЭК ${uuid}`,
			})

			req.session.orderId = order._id.toString()
			const { url, id } = await createUKPayment({
				amount: {
					currency: "RUB",
					value: (
						sum / 100 +
						(order?.delivery?.sdek?.cost || 0)
					).toFixed(2),
				},
				capture: "true",
				confirmation: {
					type: "redirect",
					return_url: `https://drobot-pigments-shop.ru/payment/${order._id.toString()}`,
				},
				metadata: {
					orderId: order._id.toString(),
					orderSum: sum,
					deliverySum: order?.delivery?.sdek?.cost || 0,
					msOrderId,
				},
				receipt: {
					email: client.mail || '',
					phone: client.tel,
					items: items.map(({ amount, name, cost }) => ({
						amount: { 
							value: cost.toFixed(2),
							currency: 'RUB'
						 },
						description: name,
						quantity: amount.toString(),
						vat_code: 1,
					})).concat({
						amount: { 
							value: (order.delivery.sdek?.cost || 0).toFixed(2),
							currency: 'RUB'
						 },
						description: 'Доставка',
						quantity: '1',
						vat_code: 1,
					})
				}
			})

			order.payment = { paymentId: id }
			await order.save()
			
			await createContact(client.name, client.tel)

			return res.json({ url, orderNumber: order.number} )
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

router.get('/delivery/cities/:str', async (req: Request<{str: string}>, res) => {
	try {
		const { str } = req.params
		const points = await PointsModel.find()
		const cities = points.reduce<{ city: string, city_code: number }[]>((cities, { location }) => {
			if ( cities.some(({ city }) => city === location.city) ) {
				return cities
			}
			const { city, city_code } = location
			return cities.concat({ city, city_code })
		}, [])
		const relevant = cities.filter(({ city }) => city.toLowerCase().includes(str.toLowerCase())).splice(0, 5)
		return res.json(relevant)
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.get('/delivery/points', async (req, res) => {
	try {
		const city_code = req.session.delivery?.city_code
		if ( !city_code ) {
			return res.json([])
		}
		const points = await PointsModel.find({ 'location.city_code': city_code })
		return res.json(points)
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.post('/check-number/init', bodyParser.json(), async (req: Request<{}, {}, {phone: string}>, res) => {
	try {
		const { phone } = req.body
		const key = await checkNumber(phone)
		req.session.plusofonKey = key
		req.session.candidateNumber = phone
		return res.end()
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.post('/check-number/pin', bodyParser.json(), async (req: Request<{}, {}, {pin: string}>, res) => {
	try {
		const { pin } = req.body
		if ( !req.session.plusofonKey ) {
			throw new Error('Отсутсвует ключ Plusofon')
		}
		if (!req.session.candidateNumber) {
			throw new Error("К сессии не привязан номер")
		}
		const result = await checkPin(req.session.plusofonKey, pin)
		if (result === 1 ) {
			let client = await ClientModel.findOne({ tel: req.session.candidateNumber })
			if ( !client ) {
				const counterparty = await getCounterPartyByNumber(req.session.candidateNumber)
				if (counterparty) {
					client = await new ClientModel({
						counterpartyId: counterparty.id,
						name: counterparty.name,
						tel: req.session.candidateNumber,
					}).save()
				} else {
					client = await new ClientModel({
						tel: req.session.candidateNumber,
					}).save()
				}
			}
			req.session.userId = client._id.toString()
			if ( client.name ) {
				if ( !req.session.delivery ) {
					req.session.delivery = {}
				}
				req.session.delivery.recipientName = client.name
			}
			if (client.mail) {
				if (!req.session.delivery) {
					req.session.delivery = {}
				}
				req.session.delivery.recipientMail = client.mail
			}
			return res.end()
		}
		if ( result === -3 ) {
			return res.status(500).json({ message: "Неверный код" })
		}
		return res.status(500).json({ message: "Ошибка, попробуйте ещё раз" })
	}
	catch (e) {
		console.log(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

router.get('/check-payment/probably', async (req, res) => {
	try {
		const { orderId } = req.session
		const order = await OrderModel.findById<IOrder>(orderId)
		if ( !order ) {
			throw new Error(`Заказ ${orderId} не найден...`)
		}
		return res.json(!!order.payment?.probably)
	}
	catch (e) {
		console.log(e)
		return res.end()
	}
})

export default router