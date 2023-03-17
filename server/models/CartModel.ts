import { model, Model, Schema } from 'mongoose';
import { ICartDoc } from "../../shared";
import rests from '../moyskladAPI/rests';
import ClientModel from './ClientModel';
import DelegateDiscountModel from './DelegateDiscountModel';
import ProductModel from './ProductModel';
import PromocodeModel from './PromocodeModel';

interface IMethods {
	refreshPrices: () => Promise<ICartDoc | null>
	refreshDiscounts: () => Promise<ICartDoc | null>
	refreshCashBack: () => Promise<ICartDoc | null>
	refreshTotal: () => Promise<ICartDoc | null>
	addProduct: (productId: string, quantity: number) => Promise<ICartDoc | null>
	addVariant: (
		productId: string,
		variantId: string,
		quantity: number
	) => Promise<ICartDoc | null>
	resetCheckAll: () => Promise<ICartDoc | null>
	toggleCheckAll: () => Promise<ICartDoc | null>
	toggleCheck: (productId: string, variantId?: string) => Promise<ICartDoc | null>
}

interface ICartModel extends Model<ICartDoc, {}, IMethods> {
	getCart: (id: string) => Promise<ICartDoc | null>
	refreshCart: (id: string) => Promise<ICartDoc | null>
}

const CartSchema = new Schema<ICartDoc, ICartModel>({
	amount: Number,
	availableCashBack: Number,
	discount: Number,
	products: [
		{
			productId: String,
			productName: String,
			price: Number,
			quantity: Number,
			discountOn: Number,
			paidByCashBack: Number,
			checked: Boolean
		},
	],
	promocode: { promocodeId: String, code: String },
    total: Number,
    useCashBack: Boolean,
    variants: [{
        productId: String,
		variantId: String,
		productName: String,
		variantName: String,
		price: Number,
		quantity: Number,
		discountOn: Number,
		paidByCashBack: Number,
		checked: Boolean
    }]
}, { expireAfterSeconds: 3600 * 24 * 42 })

CartSchema.statics.getCart = async function (id: string): Promise<ICartDoc | null> {
	try {
		return await this.findById(id).then(doc => {
			if ( !doc ) return doc
			return doc.toObject()
		})
	} catch (e) { throw e }
}

CartSchema.statics.refreshCart = async function (id: string): Promise<ICartDoc | null> {
	try {
		const cart = await this.findById(id)
		if (cart) {
			// обновление цен;
			await cart.refreshPrices()

			// обновление скидок;
			await cart.refreshDiscounts()

			// обновление оплаты кэшбэком;
			await cart.refreshCashBack()

			// обновление общих показателей корзины;
			return await cart.refreshTotal()
		}
		return null
	} catch (e) {
		throw e
	}
}

// ставит актуальные цены всем товарам и модификациям;
CartSchema.methods.refreshPrices = async function (this: ICartDoc): Promise<ICartDoc | null> {
	try {
		// получение продуктов из БД;
		const ids = this.products.map(({ productId }) => productId).concat(this.variants.map(({ productId }) => productId))
		const productsFromDB = await ProductModel.find({ _id: { $in: ids } })

		// получение продуктов со свежей ценой;
		const products = this.products.map((item) => {
			const price = productsFromDB.find(({ _id }) => _id.toString() === item.productId)?.price
			if (price) {
				return { ...item, price: price / 100 }
			}
			return item
		})

		// получение вариантов со свежей ценой;
		const variants = this.variants.map((item) => {
			const price = productsFromDB
				.find(({ _id }) => _id.toString() === item.productId)
				?.variants.find(({ _id }) => _id?.toString() === item.variantId)?.price
			if (price) {
				return { ...item, price: price / 100 }
			}
			return item
		})

		// сохранение в БД;
		this.products = products
		this.variants = variants
		await this.save()

		return this
	} catch (e) { throw e }
}

// обновляет значение скидок;
CartSchema.methods.refreshDiscounts = async function (this: ICartDoc): Promise<ICartDoc | null> {
	try {
		const client = await ClientModel.findOne({ cartId: this._id })

		// значение скидки в процентах;
		let discountPercent: number | undefined

		// для розничного покупателя;
		if (client?.status === "common") {
			// значение скидки в процентах;
			let discountPercent: number | undefined
			let promocodeDiscountPercent: number | undefined

			// скидка покупателя;
			const clientDiscount = await client.getDiscount().then((doc) => doc?.discountPercentValue)
			if (clientDiscount) {
				discountPercent = clientDiscount
			}

			// если применён промокод, пробуем привязать скидку промокода;
			if (this.promocode?.promocodeId) {
				const promocodeDiscount = await PromocodeModel.getDiscountPercentValue(this.promocode.promocodeId)
				if (promocodeDiscount && promocodeDiscount > 0) {
					promocodeDiscountPercent = promocodeDiscount
				}
			}

			if (
				(typeof discountPercent !== "undefined" && discountPercent > 0) ||
				(typeof promocodeDiscountPercent !== "undefined" && promocodeDiscountPercent > 0)
			) {
				this.products.forEach(async (product) => {
					// если есть скидка по промокоду;
					if (typeof promocodeDiscountPercent !== "undefined" && promocodeDiscountPercent > 0) {
						// если товар скидочный, применяем скидку по промокоду;
						const isDiscounted = await ProductModel.isDiscounted(product.productId)
						if (isDiscounted) {
							product.discountOn = Math.round((product.price * promocodeDiscountPercent) / 100)
						} else {
							// если нет, то проверяем скидку покупателя;
							if (typeof discountPercent !== "undefined" && discountPercent > 0) {
								product.discountOn = Math.round((product.price * discountPercent) / 100)
							} else {
								product.discountOn = undefined
							}
						}
					} else {
						// если нет, то проверяем скидку покупателя;
						if (typeof discountPercent !== "undefined" && discountPercent > 0) {
							product.discountOn = Math.round((product.price * discountPercent) / 100)
						} else {
							product.discountOn = undefined
						}
					}
				})
				this.variants.forEach(async (variant) => {
					// если есть скидка по промокоду;
					if (typeof promocodeDiscountPercent !== "undefined" && promocodeDiscountPercent > 0) {
						// если товар скидочный, применяем скидку по промокоду;
						const isDiscounted = await ProductModel.isDiscounted(variant.productId)
						if (isDiscounted) {
							variant.discountOn = Math.round((variant.price * promocodeDiscountPercent) / 100)
						} else {
							// если нет, то проверяем скидку покупателя;
							if (typeof discountPercent !== "undefined" && discountPercent > 0) {
								variant.discountOn = Math.round((variant.price * discountPercent) / 100)
							} else {
								variant.discountOn = undefined
							}
						}
					} else {
						// если нет, то проверяем скидку покупателя;
						if (typeof discountPercent !== "undefined" && discountPercent > 0) {
							variant.discountOn = Math.round((variant.price * discountPercent) / 100)
						} else {
							variant.discountOn = undefined
						}
					}
				})
				await this.save()
				return this
			}
			// если скидка отсутвует, нужно очистить все поля discountOn;
			else {
				this.products.forEach((product) => (product.discountOn = undefined))
				this.variants.forEach((variant) => (variant.discountOn = undefined))
				await this.save()
				return this
			}
		}

		// для агента;
		if (client?.status === "agent") {
			// значение скидки в процентах;
			let discountPercent: number | undefined

			// скидка покупателя;
			const clientDiscount = await client.getDiscount().then((doc) => doc?.discountPercentValue)
			if (clientDiscount) {
				discountPercent = clientDiscount
			}

			if (typeof discountPercent !== "undefined" && discountPercent > 0) {
				this.products.forEach(async (product) => {
					// узнаёем, является ли товар скидочным;
					const isDiscounted = await ProductModel.isDiscounted(product.productId)

					if (isDiscounted) {
						product.discountOn = Math.round((product.price * (discountPercent || 0)) / 100)
					} else {
						product.discountOn = undefined
					}
				})
				this.variants.forEach(async (variant) => {
					// узнаёем, является ли товар скидочным;
					const isDiscounted = await ProductModel.isDiscounted(variant.productId)

					if (isDiscounted) {
						variant.discountOn = Math.round((variant.price * (discountPercent || 0)) / 100)
					} else {
						variant.discountOn = undefined
					}
				})
				await this.save()
				return this
			}
			// если скидка отсутвует, нужно очистить все поля discountOn;
			else {
				this.products.forEach((product) => (product.discountOn = undefined))
				this.variants.forEach((variant) => (variant.discountOn = undefined))
				await this.save()
				return this
			}
		}

		// для представителя;
		if (client?.status === "delegate" || client?.status === "coach") {
			const delegateDiscounts = await DelegateDiscountModel.find().sort({ lowerTreshold: -1 })
			// вычисление общей суммы товаров;
			const amount = this.products
				.filter(({ checked }) => checked)
				.map(({ price, quantity }) => price * quantity)
				.concat(this.variants.filter(({ checked }) => checked).map(({ price, quantity }) => price * quantity))
				.reduce((sum, item) => sum + item, 0)

			// поиск подходящего уровня скидки;
			const discountLevel = delegateDiscounts.find(({ lowerTreshold, percentValue }) => (1 - percentValue) * amount >= lowerTreshold)
			if (discountLevel?.percentValue) {
				discountPercent = discountLevel.percentValue
			}

			if (typeof discountPercent !== "undefined" && discountPercent > 0) {
				this.products.forEach(async (product) => {
					// узнаёем, является ли товар скидочным;
					const isDiscounted = await ProductModel.isDiscounted(product.productId)

					if (isDiscounted) {
						product.discountOn = Math.round((product.price * (discountPercent || 0)) / 100)
					} else {
						product.discountOn = undefined
					}
				})
				this.variants.forEach(async (variant) => {
					// узнаёем, является ли товар скидочным;
					const isDiscounted = await ProductModel.isDiscounted(variant.productId)

					if (isDiscounted) {
						variant.discountOn = Math.round((variant.price * (discountPercent || 0)) / 100)
					} else {
						variant.discountOn = undefined
					}
				})
				await this.save()
				return this
			}
			// если скидка отсутвует, нужно очистить все поля discountOn;
			else {
				this.products.forEach((product) => (product.discountOn = undefined))
				this.variants.forEach((variant) => (variant.discountOn = undefined))
				await this.save()
				return this
			}
		}

		this.products.forEach((product) => (product.discountOn = undefined))
		this.variants.forEach((variant) => (variant.discountOn = undefined))
		await this.save()
		return this
	} catch (e) {
		throw e
	}
}

// обновляет значение оплаты кэшбэком;
CartSchema.methods.refreshCashBack = async function (this: ICartDoc): Promise<ICartDoc | null> {
	try {
		const client = await ClientModel.findOne({ cartId: this._id })

		// предварительная сумма корзины с учетом скидок;
		const preTotal =
			this.products.filter(({ checked }) => (checked)).reduce((total, { price, discountOn }) => total + price - (discountOn || 0), 0) +
			this.variants.filter(({ checked }) => (checked)).reduce((total, { price, discountOn }) => total + price - (discountOn || 0), 0)

		// получение даступного кэшбэка;
		let availableCashBack: number | undefined
		if (client && client?.cashBack && client.cashBack > 0 && (client.status === "delegate" || client.status === "agent")) {
			availableCashBack = Math.min(preTotal - 1, client.cashBack)
		}

		// добавление доступного кэщбэка в корзину;
		if (typeof availableCashBack !== "undefined" && availableCashBack > 0) {
			this.availableCashBack = availableCashBack
		} else {
			this.availableCashBack = undefined
			delete this.availableCashBack
		}

		// если кэшбэк доступен и пользователь хочет его использовать;
		if (typeof availableCashBack !== "undefined" && availableCashBack > 0 && this.useCashBack) {
			let cashBackWallet = availableCashBack
			this.products.filter(({ checked }) => (checked)).forEach((product) => {
				if (cashBackWallet > 0) {
					const priceWithDiscount = product.price - (product.discountOn || 0)
					const amountWithDiscount = priceWithDiscount * product.quantity
					const factPrice = Math.max(0, amountWithDiscount - cashBackWallet) / product.quantity
					product.paidByCashBack = priceWithDiscount - factPrice
					cashBackWallet -= product.paidByCashBack * product.quantity
				} else {
					product.paidByCashBack = undefined
					delete product.paidByCashBack
				}
			})
			this.variants.filter(({ checked }) => (checked)).forEach((variant) => {
				if (cashBackWallet > 0) {
					const priceWithDiscount = variant.price - (variant.discountOn || 0)
					const amountWithDiscount = priceWithDiscount * variant.quantity
					const factPrice = Math.max(0, amountWithDiscount - cashBackWallet) / variant.quantity
					variant.paidByCashBack = priceWithDiscount - factPrice
					cashBackWallet -= variant.paidByCashBack * variant.quantity
				} else {
					variant.paidByCashBack = undefined
					delete variant.paidByCashBack
				}
			})
			
			await this.save()
			return this
		} else {
			this.products.forEach((product) => product.paidByCashBack = undefined)
			this.variants.forEach((variant) => variant.paidByCashBack = undefined)
			await this.save()
			return this
		}
	} catch (e) {
		throw e
	}
}

// обновление общих показателей корзины;
CartSchema.methods.refreshTotal = async function (this: ICartDoc): Promise<ICartDoc | null> {
	try {
		// обновление полной суммы корзины без скидок и оплаты кэшбэком;
		const amount = this.products
			.filter(({ checked }) => checked)
			.map(({ price, quantity }) => price * quantity)
			.concat(this.variants.filter(({ checked }) => checked).map(({ price, quantity }) => price * quantity))
			.reduce((sum, item) => sum + item, 0)
		this.amount = amount

		// обновление полной скидки корзины без оплаты кэшбэком;
		const discount = this.products
			.filter(({ checked }) => checked)
			.map(({ discountOn, quantity }) => (discountOn || 0) * quantity)
			.concat(this.variants.filter(({ checked }) => checked).map(({ discountOn, quantity }) => (discountOn || 0) * quantity))
			.filter((item) => typeof item === "number")
			.reduce<number>((sum, item) => sum + (item || 0), 0)
		this.discount = discount

		// обновление финальной стоимости корзины;
		const paidByCashBack = this.products
			.filter(({ checked }) => checked)
			.map(({ paidByCashBack, quantity }) => (paidByCashBack || 0) * quantity)
			.concat(this.variants.filter(({ checked }) => checked).map(({ paidByCashBack, quantity }) => (paidByCashBack || 0) * quantity))
			.reduce<number>((sum, item) => sum + (item || 0), 0)
		this.total = amount - discount - Math.round(paidByCashBack)

		await this.save()
		return this
	} catch (e) {
		throw e
	}
}

// добавление товара;
CartSchema.methods.addProduct = async function ( this: ICartDoc, productId: string, quantity: number): Promise<ICartDoc | null> {
	try {
		const product = await ProductModel.findById(productId)
		if (!product) {
			throw new Error("Товар не найден")
		}

		const stock = await rests({ assortmentId: [product.identifier] })
		if (!stock) {
			const err = new Error("Товар отсутсвует в продаже")
			err.userError = true
			throw err
		}

		const { name, price = 0 } = product
		const item: ICartDoc["products"][0] = { price, productId, productName: name, quantity, checked: true }

		// добавляем товар в корзину, или увеличиваем количество;
		const index = this.products.findIndex((item) => item.productId === productId)
		if (stock * quantity === 0) {
			if (index !== -1) {
				this.products.splice(index, 1)
			}
		} else {
			if (index === -1) {
				this.products.push(item)
			} else {
				this.products[index].quantity = Math.min(quantity, stock)
			}
		}

		await this.save() // сохраняем корзину;
		return await CartModel.refreshCart(this._id.toString()) // возвращаем освежённую корзину;
	} catch (e) {
		throw e
	}
}

// добавление модификации;
CartSchema.methods.addVariant = async function (
	this: ICartDoc,
	productId: string,
	variantId: string,
	quantity: number
): Promise<ICartDoc | null> {
	try {
		const product = await ProductModel.findById(productId)
		if (!product) {
			throw new Error("Товар не найден")
		}

		const variant = product.variants.find(({ _id }) => _id?.toString() === variantId)
		if (!variant) {
			throw new Error("Вариант не найден")
		}

		const stock = await rests({ assortmentId: [variant.identifier] })
		if (!stock) {
			throw new Error("Остаток не получен")
		}

		const { name: productName } = product
		const { price, name: variantName } = variant
		const item: ICartDoc["variants"][0] = {
			price,
			productId,
			productName,
			quantity,
			variantId,
			variantName,
			checked: true
		}

		// добавляем товар в корзину, или увеличиваем количество;
		const index = this.variants.findIndex((item) => item.variantId === variantId)
		if (stock * quantity === 0) {
			if (index !== -1) {
				this.variants.splice(index, 1)
			}
		} else {
			if (index !== -1) {
				this.variants[index].quantity = Math.min(quantity, stock)
			} else {
				this.variants.push(item)
			}
		}

		await this.save() // сохраняем корзину;
		return await CartModel.refreshCart(this._id.toString()) // возвращаем освежённую корзину;
	} catch (e) {
		throw e
	}
}

// сброс выбранных товаров;
CartSchema.methods.resetCheckAll = async function (this: ICartDoc): Promise<ICartDoc | null> {
	try {
		// удаляем выбор в модели корзины;
		this.products.forEach(item => item.checked = true)
		this.variants.forEach(item => item.checked = true)
		this.promocode = undefined
		delete this.promocode
		await this.save()
		// пересчитываем показатели корзины;
		await this.refreshPrices()
		await this.refreshDiscounts()
		await this.refreshCashBack()
		return await this.refreshTotal()
	} catch (e) { throw e }
}

// переключатель выбора всех товаров в корзине;
CartSchema.methods.toggleCheckAll = async function (this: ICartDoc): Promise<ICartDoc | null> {
	try {
		// проверем текущее состояние переключателя;
		let checked = false
		if ( this.products.length > 0 ) {
			checked = this.products.every(({ checked }) => (checked))
		}
		if ( this.variants.length > 0 ) {
			checked = this.variants.every(({ checked }) => checked)
		}
		// меняем состояние переключателя;
		checked = !checked
		// ставим новое состояние всем товарам в корзине;
		this.products.forEach((item) => item.checked = checked)
		this.variants.forEach((item) => (item.checked = checked))
		await this.save()
		// пересчитываем показатели корзины;
		await this.refreshPrices()
		await this.refreshDiscounts()
		await this.refreshCashBack()
		return await this.refreshTotal()
	} catch (e) {
		throw e
	}
}

// выбор одного товара в корзине;
CartSchema.methods.toggleCheck = async function (this: ICartDoc, productId: string, variantId?: string): Promise<ICartDoc | null> {
	try {
		// если работаем с модификацией;
		if (typeof variantId !== "undefined") {
			// находим модификацию и меняем выбор;
			const variant = this.variants.find((item) => item.variantId === variantId)
			if (variant) {
				variant.checked = !variant.checked
			}
		}
		// если работаем с товаром;
		else {
			const product = this.products.find(item => item.productId === productId)
			if ( product) {
				product.checked = !product.checked
			}
		}
		await this.save()
		// пересчитываем показатели корзины;
		await this.refreshPrices()
		await this.refreshDiscounts()
		await this.refreshCashBack()
		return await this.refreshTotal()
	} catch (e) {
		throw e
	}
}

const CartModel = model<ICartDoc, ICartModel>('Cart', CartSchema)

export default CartModel