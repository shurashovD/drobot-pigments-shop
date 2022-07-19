import { Document, Model, Types } from "mongoose"
import { FC, SVGProps } from "react"

export interface ICurrency extends Document {
	identifier: string
	name: string
	fullName: string
	isoCode: string
}

export interface IUom extends Document {
	identifier: string
	name: string
	description?: string
}

export interface ICatalog extends Document {
    archived?: boolean
    identifier: string
    name: string
    parent: Types.ObjectId
}

export interface IProduct extends Document {
	archived: boolean
	available: number
	currency: Types.ObjectId
	description?: string
	identifier: string
	name: string
	parent: Types.ObjectId
	parentCategory?: Types.ObjectId
	photo: string[]
	photoUpdated?: string
	properties: Types.ObjectId[]
	price?: number
	uom: Types.ObjectId
	variantsLabel?: string
	variants: Types.DocumentArray<{
		identifier: string
		name: string
		photo?: string
		photoUpdate?: string
		price: number
		value: string
	}>
	weight?: number
	createBind(bindTitle: string, productLabel: string): Promise<IProduct>
	updateBind(
		bindId: string,
		bindTitle: string,
		productLabel: string
	): Promise<IProduct>
	deleteBind(bindId: string): Promise<IProduct>
	bindProduct(
		bindId: string,
		bindLabel: string,
		productId: string
	): Promise<IProduct>
	reBindProduct(bindId: string, productId: string): Promise<IProduct>
	setFilter(fieldId: Types.ObjectId): Promise<IProduct>
	resetFilter(fieldId: Types.ObjectId): Promise<IProduct>
}

interface IProductMethods {
	createBind(bindTitle: string, productLabel: string): Promise<IProduct>
	updateBind(
		bindId: string,
		bindTitle: string,
		productLabel: string
	): Promise<IProduct>
	deleteBind(bindId: string): Promise<IProduct>
	bindProduct(
		bindId: string,
		bindLabel: string,
		productId: string
	): Promise<IProduct>
	reBindProduct(bindId: string, productId: string): Promise<IProduct>
	setFilter(valueId: Types.ObjectId): Promise<IProduct>
	resetFilter(fieldId: Types.ObjectId): Promise<IProduct>
}

export interface Product {
	archived: boolean
	available: number
	category?: string
	currency: string
	description?: string
	id: string
	name: string
	photo: string[]
	properties: string[]
	price?: number
	uom: string
	variantsLabel?: string
	variants: {
		id: string
		identifier: string
		name: string
		photo?: string
		price: number
		value: string
	}[]
	weight?: number
}

export interface IProductModel extends Model<IProduct, {}, IProductMethods> {
	getProduct(id: string): Promise<Product>
}

export interface IFilter extends Document {
	fields: Types.DocumentArray<{
		products: Types.ObjectId[]
		value: string
	}>
	title: string
}

export interface ICategory extends Document {
	archived: boolean
	description?: string
	filters: Types.DocumentArray<IFilter>
	photo: string[]
	frontEndKey: 'pigments' | 'clothes' | 'brows' | 'remove' | 'eqipment'
	products: Types.ObjectId[]
	title: string
	addFilter(title: string): Promise<ICategory>
	rmFilter(filterId: string): Promise<ICategory>
	updFilter(filterId: string, title: string): Promise<ICategory>
	addField(filterId: string, value: string): Promise<ICategory>
	rmField(filterId: string, fieldId: string): Promise<ICategory>
	updField(
		filterId: string,
		fieldId: string,
		value: string
	): Promise<ICategory>
	addProduct(productId: string): Promise<ICategory>
	rmProduct(productId: string): Promise<ICategory>
	getProducts(
		filters?: string[][],
		limit?: number,
		page?: number,
		sortByPrice?: boolean
	): Product[]
}

export interface ICategoryMethods {
	addFilter(title: string): Promise<ICategory>
	rmFilter(filterId: string): Promise<ICategory>
	updFilter(filterId: string, title: string): Promise<ICategory>
	addField(filterId: string, value: string): Promise<ICategory>
	rmField(filterId: string, fieldId: string): Promise<ICategory>
	updField(filterId: string, fieldId: string, value: string): Promise<ICategory>
	addProduct(productId: string): Promise<ICategory>
	rmProduct(productId: string): Promise<ICategory>
	getProducts(
		filters?: string[][],
		limit?: number,
		page?: number,
		sortByPrice?: boolean
	): { length: number, products: Product[] }
}

export type CategoryModel = Model<ICategory, {}, ICategoryMethods>

export interface IOrder extends Document {
	client: Types.ObjectId
	date: Date
	delivery: {
		sdek?: {
			uuid?: string
			cost?: number 
		}
	}
	payment?: {
		paymentId: string
		status?: string
		probably?: boolean
	}
	products: Types.DocumentArray<{
		product: Types.ObjectId
		quantity: number
	}>
	variants: Types.DocumentArray<{
		product: Types.ObjectId
		variant: Types.ObjectId
		quantity: number
	}>
	msOrderId?: string
	number: number
	status: "new" | "isReading" | "compiling" | "deliveried" | "complete"
	total?: number
}

export interface IOrderPop extends Document {
	client: IClient
	date: string
	delivery: {
		address: string
	}
	products: [
		{
			product: IProduct
			quantity: number
		}
	]
	variants: Types.DocumentArray<{
		product: Types.ObjectId
		variant: IProduct['variants'][0]
		quantity: number
	}>
	number: number
	status: "new" | "isReading" | "compiling" | "deliveried" | "complete"
	total: number
}

export interface IClient extends Document {
	addresses: string[]
	counterpartyId?: string
	mail?: string
	name?: string
    orders: Types.ObjectId[]
	tel: string
}

export interface IMSHook {
	url: string
	action: "CREATE" | "UPDATE" | "DELETE"
	entityType: "productfolder" | "product" | "variant" | string
	id?: string
	method?: string
	enabled?: boolean
}

export interface IReqId extends Document {
	requestId: string
}

export interface ISdekPoints {
	code: string
	name: string
	location: {
		country_code: string
		region_code: number
		region: string
		city_code: number
		city: string
		fias_guid?: string
		postal_code: string
		longitude: number
		latitude: number
		address: string
		address_full: string
	}
	address_comment?: string
	nearest_station: string
	nearest_metro_station?: string
	work_time: string
	phones: {
		number: string
		additional?: string
	}[]
	email: string
	note?: string
	type: "PVZ" | "POSTAMAT"
	owner_сode: "cdek" | "InPost"
	take_only: boolean
	is_handout: boolean
	is_reception: boolean
	is_dressing_room: boolean
	have_cashless: boolean
	have_cash: boolean
	allowed_cod: boolean
	site?: string
	office_image_list: {
		url: string
		number: number
	}[]
	work_time_list: {
		day: number
		time?: string
	}[]
	work_time_exceptions: {
		date: string
		time?: string
		is_working: boolean
	}[]
	weight_min?: number
	weight_max?: number
	fulfillment?: boolean
	dimensions?: {
		width: number
		height: number
		depth: number
	}[]
	errors?: {
		code: string
		message: string
	}[]
}

export interface ISdekPointDoc extends ISdekPoints, Document {}

export interface ISdekCalcPayload {
	date?: string
	tariff_code: 138 | 139 | 366
	from_location: {
		code: number
	}
	to_location: {
		code: number
		address?: string
	}
	packages: {
		weight: number
		length?: number
		width?: number
		height?: number
	}[]
}

export interface ISdekCalcResponse {
	delivery_sum: number
	period_min: number
	period_max: number
	weight_calc: number
	total_sum: number
	currency: string
	services?: any[]
	errors?: {
		code: string
		message: string
	}[]
}

export interface ISdekOrderPayload {
	number?: string
	tariff_code: 138 | 139 | 366
	comment?: string
	delivery_point?: string
	recipient: {
		name: string
		phones: {number: string}[]
		number: string
	}
	from_location: {
		address: string
		code?: number
	}
	to_location?: {
		code?: number
		address: string
	}
	packages: {
		number: string
		weight: number
		length?: number
		width?: number
		height?: number
		items: {
			name: string
			ware_key: string
			payment: {
				value: number
			}
			cost: number
			weight: number
			amount: number
		}[]
	}[]
}

export interface ISdekOrderResponse {
	entity?: {
		uuid?: string
	}
	requests: {
		request_uuid?: string
		type: "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "GET"
		date_time: string
		state: "ACCEPTED" | "WAITING" | "SUCCESSFUL" | "INVALID"
	}[]
	errors?: {
		code: string
		message: string
	}[]
	warnings?: {
		code: string
		message: string
	}[]
	related_entities?: {
		type: "waybill" | "barcode"
		uuid: string
	}[]
}

export interface ISdekOrderInfo {
	entity?: {
		uuid: string
		is_return: boolean
		is_reverse: boolean
		type: 1 | 2
		cdek_number?: string
		number?: string
		delivery_mode: string
		tariff_code: number
		comment?: string
		shipment_point?: string
		delivery_point?: string
		sender: {
			company?: string
			name: string
			number?: string
		}
		recipient: {
			company?: string
			name: string
			number: string
		}
		from_location: {
			code: string
			city: string
			address?: string
		}
		to_location: {
			code: number
			city: string
			address?: string
		}
		packages: {
			package_id: string
			number: string
			weight: number
			items: {
				name: string
				ware_key: string
				payment: { value: number }
				cost: number
				weight: number
				amount: number
			}[]
		}
		delivery_problem?: {
			code: string
			create_date: string
		}[]
		delivery_detail?: {
			date: string
			recipient_name: string
			payment_info: {
				type: "CASH" | "CARD"
				sum: number
			}
			delivery_sum: number
			total_sum: number
		}
		statuses: {
			code: string
			name: string
			date_time: string
		}[]
	}
	requests: {
		request_uuid?: string
		type: "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "GET"
		date_time: string
		state: "ACCEPTED" | "WAITING" | "SUCCESSFUL" | "INVALID"
		errors?: {
			code: string
			message: string
		}[]
		warnings?: {
			code: string
			message: string
		}[]
	}[]
}

export interface IUKassaNotice {
	event: string
	object: {
		id: string
		status: string
		paid: boolean
		amount: {
			value: "2.00"
			currency: "RUB"
		}
		description?: string
		test: boolean
	}
}

export interface IAmoAuthCodeExchangePayload {
	client_id: string
	client_secret: string
	grant_type: "authorization_code"
	code: string
	redirect_uri: string
}

export interface IAmoAuthCodeExchangeResponse {
	token_type: string
	expires_in: number
	access_token: string
	refresh_token: string
}

export interface IAmoAuthCodeExchangeResponseDoc extends Document, IAmoAuthCodeExchangeResponse {}

export interface IAmoRefreshTokenPayload {
	client_id: string
	client_secret: string
	grant_type: "refresh_token"
	refresh_token: string
	redirect_uri: string
}

export interface IAmoRefreshTokenResponse {}

export interface ICart {
	products: {
		productId: string
		quantity: number
	}[]
	variants: {
		productId: string
		variantId: string
		quantity: number
	}[]
}

declare global {
	interface Error {
		userError?: boolean
	}
}

declare global {
	var sdekToken: string
	var refreshTokenTime: number
	var plusofonToken: string
	namespace NodeJS {
		interface Global {
			refreshTokenTime: number
			sdekToken: string
			plusofonToken: string
		}
	}
}

declare module 'express-session' {
	interface SessionData {
		isAdmin?: boolean
		cart?: ICart
		orderId?: string
		userId?: string
		plusofonKey?: string
		candidateNumber?: string
		delivery?: {
			city_code?: number
			sdek?: {
				checked: boolean
				tariff_code: 138 | 139 | 366
				address?: string
				code?: string
				cost?: number
			},
			recipientName?: string
			recipientMail?: string
		}
	}
}

declare module "*.svg" {

	export const ReactComponent: FC<SVGProps<SVGSVGElement> & { title?: string }>

	const src: string
	export default src
}