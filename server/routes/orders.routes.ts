import { Types } from 'mongoose';
import { json } from 'body-parser';
import { IOrder, ICartDoc } from './../../shared/index.d';
import { checkNumber, checkPin } from './../plusofonAPI/plusofonApi';
import bodyParser from 'body-parser';
import { Request, Router } from "express";
import { ISdekCalcPayload } from '../../shared';
import ClientModel from "../models/ClientModel";
import OrderModel from "../models/OrderModel";
import PointsModel from '../models/PointsModel';
import ProductModel, { VariantModel } from '../models/ProductModel'
import { sdekCalcDelivery } from '../sdekAPI/calc';
import getCounterPartyByNumber from '../moyskladAPI/counterparty';
import errorHandler, { logger } from '../handlers/errorLogger';
import createMsOrderHandler from '../handlers/createMsOrderHandler';
import createPaymentHandler from '../handlers/createPaymentHandler';
import CartModel from '../models/CartModel';

const formatter = Intl.DateTimeFormat('ru', {
	day: 'numeric',
	month: 'short',
	year: '2-digit',
	hour: 'numeric',
	minute: '2-digit'
})

const router = Router()

// получить все заказы;
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
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

// получить корзину;
router.get('/cart', async (req, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)

		// если пользователь авторизован, попробуем выдать его корзину;
		if (client) {
			// если у пользователя есть корзина;
			if (client?.cartId) {
				const cart = await CartModel.refreshCart(client.cartId.toString())
				// вернем его корзину;
				if (cart) {
					return res.json(cart)
				}
			}

			// если нет, то создадим её;
			const cart = await new CartModel().save()
			client.cartId = cart._id
			await client.save()
			// и вернём;
			return res.json(cart)
		}

		// если пользователь не авторизован, проверим сессию на наличие корзины;
		if ( req.session.cartId ) {
			const sessionCart = await CartModel.refreshCart(req.session.cartId)
			// если корзина есть в сессии, отдаём её;
			if (sessionCart) {
				return res.json(sessionCart)
			}
		}

		// если и в сессии не оказалось корзиныж
		const newCart = await new CartModel().save() // то создаём её;
		req.session.cartId = newCart._id.toString() // привязываем к сессии;
		return res.json(newCart)// и отдаём её;
	}
	catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Ошибка получения корзины...' })
	}
})

// получить город доставки;
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

		return res.json({ region: point.location.region, city: point.location.city, city_code })
	}
	catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// получить детали доставки;
router.get("/delivery/detail", async (req, res) => {
	try {
		let cart
		// смотрим, авторизован ли пользователь и есть ли у него корзина;
		const client = await ClientModel.findById(req.session.userId)
		if ( client ) {
			const clientCart = await CartModel.getCart(client.cartId?.toString() || '')
			if (clientCart) {
				cart = clientCart
			}
		}
		// если пользователь не авторизован, проверим корзину сессии;
		else {
			const sessionCart = await CartModel.getCart(req.session.cartId || '')
			if ( sessionCart ) {
				cart = sessionCart
			}
		}

		// если корзина не найдена, выходим;
		if ( typeof cart === 'undefined' ) {
			return res.end()
		}

		// если самовывоз из магазина;
		if ( req.session.delivery?.pickup?.checked ) {
			return res.json({ pickup: true, address: "ул. Дзержинского 87/1" })
		}

		// если доставка СДЭК;
		if ( req.session.delivery?.sdek && req.session.delivery?.city_code && cart ) {
			const { checked, tariff_code, address, code } = req.session.delivery.sdek
			const { city_code } = req.session.delivery
			const ids = cart.products.map(({ productId }) => productId).concat(cart.variants.map(({ productId }) => productId))
			const products = await ProductModel.find({ _id: { $in: ids } })
			const packages: ISdekCalcPayload['packages'] = cart.products.map(({ productId, quantity }) => {
				const product = products.find(({ _id }) => _id?.toString() === productId)
				return { weight: (product?.weight || 25) * quantity }
			}).concat(
				cart.variants.map(({ productId, quantity }) => {
					const product = products.find(({ _id }) => _id?.toString() === productId)
					return { weight: (product?.weight || 25) * quantity }
				})
			)
			const sdekInfo = await sdekCalcDelivery({
				from_location: { code: 435 },
				to_location: { code: +city_code },
				packages, tariff_code
			})
			const { total_sum } = sdekInfo.data

			// доставка на заказ от 20.000 рублей бесплатна;
			if ( cart.amount && cart?.amount >= 20000 ) {
				req.session.delivery.sdek.cost = 0
			} else {
				req.session.delivery.sdek.cost = total_sum
			}
			
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
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// получить доступные способы доставки;
router.get('/delivery/ways', async (req, res) => {
	try {
		const city_code = req.session.delivery?.city_code
		if ( !city_code ) {
			return res.end()
		}

		if ( +city_code === 435 ) {
			return res.json({ pickup: true, sdek: true })
		}
		return res.json({ sdek: true })
 	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// получить информацию о получателе;
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
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// задать получателя;
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
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// положить товар в корзину;
router.put("/cart/product", bodyParser.json(), async (req: Request<{}, {}, { productId: string; quantity: number }>, res) => {
	try {
		const { productId, quantity } = req.body

		// если пользователь авторизован, попробуем добавить товар в его корзину;
		const client = await ClientModel.findById(req.session.userId || '')
		if ( client ) {
			const cart = await CartModel.findById(client.cartId)
			// если корзина есть;
			if ( cart ) {
				await cart.addProduct(productId, quantity)	// положим товар туда;
				return res.end()
			} else {
				const newCart = await new CartModel().save()	// или создадим новую корзину;
				client.cartId = newCart._id.toString()			// привяже корзину к пользователю;
				await newCart.addProduct(productId, quantity)
				return res.end()
			}
		}

		// если пользователь не авторизован, положим товар в корзину сессии;
		const cart = await CartModel.findById(req.session.cartId)
		if (cart) {
			await cart.addProduct(productId, quantity)
		} 
		
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// положить модификацию в корзину;
router.put("/cart/variant", json(), async (req: Request<{}, {}, { productId: string; variantId: string, quantity: number }>, res) => {
	try {
		const { productId, variantId, quantity } = req.body

		// если пользователь авторизован, попробуем добавить товар в его корзину;
		const client = await ClientModel.findById(req.session.userId)
		if (client) {
			const cart = await CartModel.findById(client.cartId)
			// если корзина есть;
			if (cart) {
				await cart.addVariant(productId, variantId, quantity) // положим товар туда;
				return res.end()
			} else {
				const newCart = await new CartModel().save() // или создадим новую корзину;
				client.cartId = newCart._id.toString() // привяже корзину к пользователю;
				await newCart.addVariant(productId, variantId, quantity)
				return res.end()
			}
		}

		// если пользователь не авторизован, положим товар в корзину сессии;
		const cart = await CartModel.findById(req.session.cartId)
		if (cart) {
			await cart.addVariant(productId, variantId, quantity)
		}

		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// удалить товары или модификацию из корзины;
router.delete("/cart", async (req: Request<{}, {}, {}, { productIds: string; variantIds: string; products: string; variants: string }>, res) => {
	try {
		const { productIds, variantIds } = req.query
		const products: string[] = JSON.parse(productIds)
		const variants: string[] = JSON.parse(variantIds)

		let cart: ICartDoc | undefined

		// ищем корзину у клиента, затем в сессии;
		const client = await ClientModel.findById(req.session.userId)
		if (client?.cartId) {
			const clientCart = await CartModel.findById(client.cartId.toString())
			if (clientCart) {
				cart = clientCart
			}
		} else {
			const sessionCart = await CartModel.findById(req.session.cartId)
			if (sessionCart) {
				cart = sessionCart
			}
		}

		// если корзина не определена, выходим;
		if (typeof cart === "undefined" || !cart) {
			return res.end()
		}

		for (const i in products) {
			try {
				const productId = products[i]
				await cart?.addProduct(productId, 0)
			} catch (e) {
				console.log(e)
			}
		}

		for (const i in variants) {
			try {
				const variantId = variants[i]
				const variant = cart?.variants.find((item) => item.variantId === variantId)
				if (variant) {
					await cart?.addVariant(variant.productId, variant.variantId, 0)
				}
			} catch (e) {
				console.log(e)
			}
		}

		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// сбросить выбор товаров в корзине;
router.put("/cart/check/reset", async (req, res) => {
	try {
		let cart
		if ( req.session.userId ) {
			const client = await ClientModel.findById(req.session.userId)
			if ( client && client.cartId ) {
				const clientCart = await CartModel.findById(client.cartId)
				if ( clientCart ) {
					cart = clientCart
				}
			}
		}

		if ( typeof cart === 'undefined' ) {
			if ( req.session.cartId ) {
				const sessionCart = await CartModel.findById(req.session.cartId)
				if ( sessionCart ) {
					cart = sessionCart
				}
			}
		}

		if ( typeof cart === 'undefined' ) {
			return res.end()
		}

		await cart.resetCheckAll()
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// выбор всех товаров в корзине;
router.put("/cart/check/toggle-all", async (req, res) => {
	try {
		let cart
		if (req.session.userId) {
			const client = await ClientModel.findById(req.session.userId)
			if (client && client.cartId) {
				const clientCart = await CartModel.findById(client.cartId)
				if (clientCart) {
					cart = clientCart
				}
			}
		}

		if (typeof cart === "undefined") {
			if (req.session.cartId) {
				const sessionCart = await CartModel.findById(req.session.cartId)
				if (sessionCart) {
					cart = sessionCart
				}
			}
		}

		if (typeof cart === "undefined") {
			return res.end()
		}

		await cart.toggleCheckAll()
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// выбор одного товара в корзине;
router.put("/cart/check/toggle", json(), async (req: Request<{}, {}, { productId: string; variantId?: string }>, res) => {
	try {
		let cart
		if (req.session.userId) {
			const client = await ClientModel.findById(req.session.userId)
			if (client && client.cartId) {
				const clientCart = await CartModel.findById(client.cartId)
				if (clientCart) {
					cart = clientCart
				}
			}
		}

		if (typeof cart === "undefined") {
			if (req.session.cartId) {
				const sessionCart = await CartModel.findById(req.session.cartId)
				if (sessionCart) {
					cart = sessionCart
				}
			}
		}

		if (typeof cart === "undefined") {
			throw new Error("Корзина не найдена")
		}

		const { productId, variantId } = req.body
		await cart.toggleCheck(productId, variantId)
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// применить промокод;
router.put('/cart/promocode', json(), async (req: Request<{}, {}, { code: string }>, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if ( !client ) {
			return res.end()
		}

		const { code } = req.body
		const message = await client.setPromocodeInCart(code)
		if (typeof message === 'string') {
			return res.json({ message })
		}
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// отменить промокод;
router.delete('/cart/promocode', async (req, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if ( !client ) {
			return
		}

		await client.resetPromocodeInCart()
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// переключатель использования кэшбэка;
router.put('/cart/use-cashback-toggle', async (req, res) => {
	try {
		const client = await ClientModel.findById(req.session.userId)
		if ( !client ) {
			return res.end()
		}

		await client.useCashbackToggle()
		return res.end()

	} catch (e) {
		logger.error(e)
		return res.end()
	}
})

// установить город доставки;
router.put('/set/city/:city_code', async (req: Request<{city_code: number}>, res) => {
	try {
		const { city_code } = req.params
		if ( !req.session.delivery ) {
			req.session.delivery = { city_code }
		} else {
			req.session.delivery.city_code = city_code
			if ( req.session.delivery.sdek ) {
				req.session.delivery.sdek.address = undefined
				req.session.delivery.sdek.checked = false
				req.session.delivery.sdek.code = undefined
				req.session.delivery.sdek.cost = undefined
				delete req.session.delivery.sdek.address
				delete req.session.delivery.sdek.code
				delete req.session.delivery.sdek.cost
				delete req.session.delivery.sdek
			}
			if ( req.session.delivery.pickup ) {
				req.session.delivery.pickup.checked = false
			}
		}
		return res.end()
	}
	catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// установка деталей доставки;
router.put(
	"/set/delivery",
	bodyParser.json(),
	async (req: Request<{}, {}, { pickup: boolean, sdek: boolean, tariff_code?: 138 | 139 | 366, address?: string, code?: string }>,
res) => {
	try {
		if (!req.session.delivery?.city_code) {
			throw new Error(`Город доставки не определён`)
		}
		const { sdek, tariff_code, address, code, pickup } = req.body
		if ( sdek && tariff_code ) {
			req.session.delivery.pickup = undefined
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
		if ( pickup ) {
			req.session.delivery.pickup = { checked: true }
			if ( req.session.delivery.sdek?.checked ) {
				req.session.delivery.sdek.checked = false
			}
		} else {
			req.session.delivery.pickup = { checked: false }
		}
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

// создание заказа;
router.post("/", bodyParser.json(), async (req, res) => {
		try {
			const client = await ClientModel.findById(req.session.userId)
			if (!client?.cartId) {
				const err = new Error()
				err.userError = true
				err.sersviceInfo = `Клиент ${req.session.userId} не найден. Создание заказа`
				throw err
			}
			const cart = await CartModel.refreshCart(client.cartId.toString())
			if (!cart) {
				const err = new Error("Корзина не найдена")
				err.userError = true
				err.sersviceInfo = `Корзина не найдена. Клиент ${req.session.userId}. Создание заказа`
				throw err
			}
			if (cart.products.length + cart.variants.length === 0) {
				const err = new Error("Корзина пуста")
				err.userError = true
				err.sersviceInfo = `Корзина пуста. Клиент ${req.session.userId}. Создание заказа`
				throw err
			}
			if (!req.session.delivery) {
				const err = new Error("Не найдены параметры доставки")
				err.userError = true
				err.sersviceInfo = `Не найдены параметры доставки. Клиент ${req.session.userId}. Создание заказа`
				throw err
			}
			if (!req.session.delivery.city_code) {
				const err = new Error("Не найден город доставки")
				err.userError = true
				err.sersviceInfo = `Не найден город доставки. Клиент ${req.session.userId}. Создание заказа`
				throw err
			}
			const { city_code, sdek, pickup } = req.session.delivery
			if (!sdek && !pickup) {
				const err = new Error("Не найдены параметры доставки")
				err.userError = true
				err.sersviceInfo = `Не найдены параметры доставки. Клиент ${req.session.userId}. Создание заказа`
				throw err
			}

			// создание шаблона заказа в БД;
			const { recipientMail, recipientName } = req.session.delivery
			let orderId
			if ( sdek && sdek.checked ) {
				const { tariff_code, address, code } = sdek
				const sdekForOrder: IOrder["delivery"]["sdek"] = {
					city_code,
					number: `+7${client.tel}`,
					address,
					point_code: code,
					cost: req.session.delivery.sdek?.cost || 0,
					name: req.session.delivery.recipientName,
					tariff_code,
				}
				orderId = await client.createTempOrder({ recipientMail, recipientName, sdek: sdekForOrder })
			}

			if ( pickup && pickup.checked ) {
				orderId = await client.createTempOrder({ recipientMail, recipientName, pickup })
			}

			if ( !orderId ) {
				logger.error(`Не удалось создать заказ. Пользователь ${client._id.toString()}`)
				return res.status(500).json({ message: 'Не удалось создать заказ' })
			}

			// создание заказа в "Мой склад";
			const { name: number, id: msOrderId, sum } = await createMsOrderHandler(orderId)

			// запись информации о заказе "Мой склад" в заказ из БД;
			await OrderModel.setMsInfo(orderId, { number, msOrderId, msOrderSumRub: sum / 100 })

			// создание платежа в Ю-Касса;
			const { url, id } = await createPaymentHandler(orderId)
			await OrderModel.setPaymentInfo(orderId, { paymentId: id, paymentUrl: url })

			// запись информации о платеже в заказ из БД;
			try {
				await OrderModel.findByIdAndUpdate(orderId, { 'payment.paymentId': id })
			} catch (e: any) {
				const err = new Error()
				err.userError = true
				err.sersviceInfo = `Привязка заказа МС к заказу в БД. ${e.message}`
				throw err
			}

			cart.products = cart.products.filter(({ checked }) => (!checked))
			cart.variants = cart.variants.filter(({ checked }) => !checked)
			await cart.save()

			return res.json({ url, orderNumber: number })
		} catch (e: any) {
			logger.error(e)
			return res.status(500).json({ message: 'Что-то пошло не так...' })
		}
	}
)

// получение доступных городов доставки по подстроке;
router.get('/delivery/cities/:str', async (req: Request<{str: string}>, res) => {
	try {
		const { str } = req.params
		const points = await PointsModel.find({ "location.city": { $regex: str, $options: "i" } })
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
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

//получение пунктов выдачи;
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
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// создание проверки номера;
router.post('/check-number/init', bodyParser.json(), async (req: Request<{}, {}, {phone: string}>, res) => {
	try {
		const { phone } = req.body
		const key = await checkNumber(phone)
		req.session.plusofonKey = key
		req.session.candidateNumber = phone
		return res.end()
	}
	catch (e) {
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// проверка пина при авторизации;
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
		if (result === 1) {
			let client = await ClientModel.findOne({ tel: req.session.candidateNumber })
			if ( !client ) {
				const counterparty = await getCounterPartyByNumber(req.session.candidateNumber)
				if (counterparty) {
					client = await new ClientModel({
						counterpartyId: counterparty.id,
						name: counterparty.name,
						tel: req.session.candidateNumber,
						cartId: req.session.cartId,
					}).save()
				} else {
					client = await new ClientModel({
						tel: req.session.candidateNumber
					}).save()
				}
			}
			client.sid = req.session.id
			await client.save()
			if (req.session.cartId && client) {
				client.cartId = new Types.ObjectId(req.session.cartId)
				await client.save()
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
		logger.error(e)
		return res.status(500).json({ message: 'Что-то пошло не так...' })
	}
})

// проверка вероятности оплаты заказа;
router.post("/check-payment/probably", bodyParser.json(), async (req: Request<{}, {}, { orderNumber: string }>, res) => {
	try {
		const { orderNumber: number } = req.body
		const order = await OrderModel.findOne({ number })
		if (!order) {
			throw new Error(`Заказ с номером ${number} не найден...`)
		}

		const func = `<div>Отслеживайте заказы в <NavLink to="/profile">личном кабинете</NavLink></div>`

		const response = { status: "pending", title: `Заказ ${number} оплачен!`, func }
		if ( order.payment && order.payment.status === 'succeeded' ) {
			response.status = 'succeeded'
		}
		if (order.payment && order.payment.status === "canceled") {
			response.status = "canceled"
		}
		if (order.payment && !order.payment.status && order.payment.probably) {
			response.status = 'probably'
		}
		
		res.json(response)
	} catch (e) {
		logger.error(e)
		return res.end()
	}
})

// получить один заказ;
router.get("/:id", async (req: Request<{ id: string }>, res) => {
	try {
		console.log(890)
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
			return res.status(500).json({ message: "Завка не найдена" })
		}
		if (order.status === "new") {
			await OrderModel.findByIdAndUpdate(id, { status: "isReading" })
		}

		return res.json(order)
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router