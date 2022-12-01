import * as core from "express-serve-static-core"
import * as express from "express"
import * as http from "http"
import * as https from "https"
import * as ws from "ws"
import { Document, Model, Schema, Types } from "mongoose"
import { FC, SVGProps } from "react"

interface IAmoStatuses {
	id: number
	name: string
	sort: number
	pipeline_id: number
	color: string
	type: 0 | 1
}

interface IAmoPipeline {
	id: number
	name: string
	sort: number
	_embedded: {
		statuses: IAmoStatuses[]
	}
}

export interface IAmoTag {
	id: number
	name: string
	color: string | null
}

export interface IAmoTrade {
	id: number
	name: string
	price: number
	status_id: number
	pipeline_id: number
	custom_fields_values: any[]
	_embedded: any[]
}

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

export interface IProduct extends Document, IProductMethods {
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
	rating?: number
	reviewsCount?: number
	uom: Types.ObjectId
	variantsLabel?: string
	variants: Types.DocumentArray<{
		identifier: string
		name: string
		photo?: string
		photoUpdate?: string
		price: number
		rating?: number
		reviewsCount?: number
		value: string
	}>
	weight?: number
}

interface IProductMethods {
	createBind(bindTitle: string, productLabel: string): Promise<IProduct>
	updateBind(bindId: string, bindTitle: string, productLabel: string): Promise<IProduct>
	deleteBind(bindId: string): Promise<IProduct>
	bindProduct(bindId: string, bindLabel: string, productId: string): Promise<IProduct>
	isRatedByClient(clientId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<boolean>
	reBindProduct(bindId: string, productId: string): Promise<IProduct>
	setFilter(valueId: Types.ObjectId): Promise<IProduct>
	refreshRating(variantId?: Types.ObjectId | string): Promise<void>
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
	rating?: number
	reviewsCount?: number
	uom: string
	variantsLabel?: string
	variants: {
		id: string
		identifier: string
		name: string
		photo?: string
		price: number
		rating?: number
		reviewsCount?: number
		value: string
	}[]
	variantId?: string
	weight?: number
}

export interface IProductModel extends Model<IProduct, {}, IProductMethods> {
	getProduct(id: string): Promise<Product>
	isDiscounted(id: string): Promise<boolean>
}

export interface IFilter extends Document {
	fields: Types.DocumentArray<{
		products: Types.ObjectId[]
		value: string
	}>
	title: string
}

export interface ICategorySiteProduct {
	productId: string
	productTitle: string
	price: number
	img?: string
	variantId?: string
	variantTitle?: string
	variantValue?: string
}

export interface ICategorySiteSubcategory {
	id: string
	title: string
	productsLength: number
	photo?: string
}

export interface ICategory extends Document, ICategoryMethods {
	archived: boolean
	description?: string
	filters: Types.DocumentArray<IFilter>
	photo: string[]
	frontEndKey: "pigments" | "clothes" | "brows" | "remove" | "eqipment"
	parentCategory: Types.ObjectId
	products: Types.ObjectId[]
	subCategories: Types.ObjectId[]
	title: string
	variantsFilter?: {
		variantsLabel: string
		variantsValues: string[]
	}[]
	minPrice?: number
	maxPrice?: number
}

export interface ICategoryMethods {
	addFilter(title: string): Promise<ICategory>
	createSubCategory(title: string): Promise<void>
	rmFilter(filterId: string): Promise<ICategory>
	updFilter(filterId: string, title: string): Promise<ICategory>
	addField(filterId: string, value: string): Promise<ICategory>
	rmField(filterId: string, fieldId: string): Promise<ICategory>
	updField(filterId: string, fieldId: string, value: string): Promise<ICategory>
	addProduct(productId: string): Promise<ICategory>
	rmProduct(productId: string): Promise<ICategory>
	getProducts(filters?: string[][], limit?: number, page?: number, sortByPrice?: boolean): { length: number; products: Product[] }
	getProductsAndVariants(args: {
		filters?: string[][]
		limit?: number
		page?: number
		variantsFilter?: string[]
		sortByPrice?: boolean
		minPrice?: number
		maxPrice?: number
	}): {
		length: number
		products: ICategorySiteProduct[]
	}
	getSubCategories(): Promise<ICategorySiteSubcategory[]>
}

export interface CategoryModel extends Model<ICategory, {}, ICategoryMethods> {
	rmCategory(categoryId: Types.ObjectId|string): Promise<void>
}

export interface IOrder extends Document, IOrderMethods {
	client: Types.ObjectId
	date: Date
	delivery: {
		sdek?: {
			number: string
			city_code: number
			point_code?: string
			name?: string
			address?: string
			uuid?: string
			cost?: number
			tariff_code: number
		}
		pickup?: {
			checked: boolean
		}
		recipientName?: string
		recipientMail?: string
	}
	payment?: {
		paymentId: string
		paymentUrl: string
		status?: string
		probably?: boolean
		cancelationReason?: string
	}
	products: Types.DocumentArray<{
		product: Types.ObjectId
		price: number
		quantity: number
		discountOn?: number
		paidByCashBack?: number
	}>
	variants: Types.DocumentArray<{
		product: Types.ObjectId
		variant: Types.ObjectId
		price: number
		quantity: number
		discountOn?: number
		paidByCashBack?: number
	}>
	promocode?: Types.ObjectId
	msOrderId?: string
	msOrderSumRub?: number
	tradeId: string
	number: number
	status: "new" | "payCanceled" | "compiling" | "builded" | "dispatch" | "delivering" | "ready" | "complete" | "canceled" | "return"
	total: number
}

interface IOrderMethods {
	bonusHandle: () => Promise<void>
	getNotRatedGoods: () => Promise<{ productId?: Types.ObjectId; variantId?: Types.ObjectId }[]>
}

export interface OrderModel extends Model<IOrder, {}, IOrderMethods> {
	getOrder(id: string): Promise<IOrderPop>
	setMsInfo(id: string, args: { msOrderId: string; msOrderSumRub: number; number: number }): Promise<IOrderPop>
	setPaymentInfo(id: string, args: { paymentId: string; paymentUrl: string }): Promise<IOrderPop>
	setPaymentStatus(id: string, args: { status: string; cancelationReason?: string }): Promise<IOrderPop>
}

export interface IOrderPop {
	client: IClient
	date: string
	delivery: {
		sdek?: {
			number: string
			city_code: number
			point_code: string
			name?: string
			address?: string
			uuid?: string
			cost?: number
			tariff_code: number
		}
		pickup?: {
			checked: boolean
		}
		recipientName?: string
		recipientMail?: string
	}
	id: string
	payment?: {
		paymentId: string
		paymentUrl: string
		status?: string
		probably?: boolean
		cancelationReason?: string
	}
	products: [
		{
			product: IProduct
			price: number
			quantity: number
			discountOn?: number
			paidByCashBack?: number
		}
	]
	promocode?: { id: string; code: string }
	variants: Types.DocumentArray<{
		product: IProduct
		variant: Types.ObjectId
		price: number
		quantity: number
		discountOn?: number
		paidByCashBack?: number
	}>
	msOrderId?: string
	msOrderSumRub?: number
	tradeId: string
	number: number
	status: "new" | "payCanceled" | "compiling" | "builded" | "dispatch" | "delivering" | "ready" | "complete" | "canceled" | "return"
	total: number
}

export interface IPromocode {
	id: string
	code: string
	dateStart: Date
	dateFinish: Date
	holderClient: IClient
	discountPercent: number
	orders: {
		orderId: string
		cashBack: number
	}[]
	status: "created" | "running" | "finished" | "stopped"
	promocodeTotalCashBack: number
}

interface IPromocodeMethods {
	getDetails: (this: IPromocodeDoc) => Promise<IPromocodeDetails>
}

export interface IPromocodeDoc extends Document, IPromocodeMethods {
	code: string
	dateStart: Date
	dateFinish: Date
	holderClient: Types.ObjectId
	discountPercent: number
	orders: Types.DocumentArray<{
		orderId: Types.ObjectId
		cashBack: number
	}>
	status: "created" | "running" | "finished" | "stopped"
	promocodeTotalCashBack: number
}

export interface IPromocodeDetails {
	id: string
	code: string
	dateStart: Date
	dateFinish: Date
	discountPercentValue: number
	status: "created" | "running" | "finished" | "stopped"
	total: {
		ordersLength: number
		ordersTotal: number
		totalCashBack: number
	}
	orders: {
		buyer: string
		orderTotal: number
		orderCashBack: number
		orderId: string
		orderNumber?: string
	}[]
}

export interface ICashbackReport {
	clientId: string
	name: string
	promocodes: {
		id: string
		code: string
		cashbackTotal: number
	}[]
	totalCashback: number
	totalDebites: number
	availableCashBack: number
}

export interface IDebiteReport {
	name: string
	debites: {
		date: Date
		order?: string
		orderId?: string
		orderTotal?: number
		debite: number
	}[]
}

export interface IClientMethods {
	createTempOrder(args: {
		sdek?: IOrder["delivery"]["sdek"]
		pickup?: IOrder["delivery"]["pickup"]
		recipientName?: string
		recipientMail?: string
	}): Promise<string>
	debiteCashback(total: number, orderId?: Types.ObjectId): Promise<void>
	deleteOrder(orderId: string): Promise<void>
	getCashbackReport(): Promise<ICashbackReport>
	getDebitesReport(): Promise<IDebiteReport>
	getOrder(id: string): Promise<IOrderPop>
	getDiscount(): Promise<{ discountPercentValue?: number; nextLevelRequires: string[] }>
	getNearestOrder(): Promise<IOrderPop | undefined>
	addCashback(cashbackRub: number): Promise<void>
	mergeCart(mergedCartId: string): Promise<void>
	refreshPromocodes(): Promise<void>
	getPromocodes(): Promise<IPromocodeDetails[]>
	createPromocode(code: string, dateFinish: string, dateStart: string, discountPercent?: number): Promise<void>
	setPromocodeInCart(code: string): Promise<void>
	resetPromocodeInCart(): Promise<void>
	unionCompare(compareId: Types.ObjectId | string): Promise<void>
	unionFavourite(favouriteId: Types.ObjectId | string): Promise<void>
	useCashbackToggle(): Promise<void>
}

export interface IClient extends Document, IClientMethods {
	addresses: string[]
	amoContactId?: number
	cartId?: Types.ObjectId
	compare?: Types.ObjectId
	counterpartyId?: string
	favourite?: Types.ObjectId
	mail?: string
	name?: string
	orders: Types.ObjectId[]
	tel: string
	commonPoints?: number
	cashbackDebites: {
		date: Date
		total: number
		orderId?: Types.ObjectId
	}[]
	commonOrders: Types.ObjectId[]
	agentOrders: Types.ObjectId[]
	delegateOrders: Types.ObjectId[]
	coachOrders: Types.ObjectId[]
	status?: string
	claimedStatus?: string
	promocodes?: Types.ObjectId[]
	cashBack?: number
	sid?: string
	totalCashBack?: number
	total?: number
}

export interface ClientModel extends Model<IClient, {}, IClientMethods> {
	createClient(phone: string, name?: string, mail?: string): Promise<IClient>
}

export interface IMSHook {
	url: string
	action: "CREATE" | "UPDATE" | "DELETE"
	entityType: "productfolder" | "product" | "variant" | "customerorder" | string
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
		phones: { number: string }[]
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

export interface ISdekWebhookInfo {
	uuid: string
	type: "ORDER_STATUS" | "PRINT_FORM" | "DOWNLOAD_PHOTO"
	url: string
}

export interface ISdekCreateWebhookPayload {
	type: "ORDER_STATUS" | "PRINT_FORM" | "DOWNLOAD_PHOTO"
	url: string
}

export interface ISdekWebhookPayload {
	type: "ORDER_STATUS" | "PRINT_FORM" | "DOWNLOAD_PHOTO"
	date_time: string
	uuid: string
	attributes: {
		is_return: boolean
		cdek_number: string
		number?: string
		code: string
	}
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

export interface IAmoCreateTaskPayload {
	entity_id?: number
	entity_type?: "contacts" | string
	created_at?: number
	complete_till: number
	text: string
}

export interface IAmoContact {
	amoContactId: string
	number: string
}

export interface ICart {
	products: {
		productId: string
		productName: string
		price: number
		quantity: number
		discountOn?: number
		paidByCashBack?: number
		checked?: boolean
	}[]
	variants: {
		productId: string
		variantId: string
		productName: string
		variantName: string
		price: number
		quantity: number
		discountOn?: number
		paidByCashBack?: number
		checked?: boolean
	}[]
	amount?: number
	availableCashBack?: number
	discount?: number
	promocode?: { promocodeId: string; code: string }
	total?: number
	useCashBack?: boolean
}

export interface ICartDoc extends ICart, Document {
	refreshPrices: () => Promise<ICartDoc | null>
	refreshDiscounts: () => Promise<ICartDoc | null>
	refreshCashBack: () => Promise<ICartDoc | null>
	refreshTotal: () => Promise<ICartDoc | null>
	addProduct: (productId: string, quantity: number) => Promise<ICartDoc | null>
	addVariant: (productId: string, variantId: string, quantity: number) => Promise<ICartDoc | null>
	resetCheckAll: () => Promise<ICartDoc | null>
	toggleCheckAll: () => Promise<ICartDoc | null>
	toggleCheck: (productId: string, variantId?: string) => Promise<ICartDoc | null>
}

export interface INearestOrder {
	id: string
	number: string
	date: string
	delivery?: string
	products: IProduct[]
	variants: {
		product: IProduct
		variantId: string
	}[]
}

export interface ICommonDiscount {
	id: string
	percentValue: number
	lowerTreshold: number
}

export interface ICommonDiscountDoc extends Document {
	percentValue: number
	lowerTreshold: number
}

export interface IAgentDiscount {
	id: string
	percentValue: number
}

export interface IAgentDiscountDoc extends Document {
	percentValue: number
}

export interface IDelegateDiscount {
	id: string
	percentValue: number
	lowerTreshold: number
}

export interface IDelegateDiscountDoc extends Document {
	percentValue: number
	lowerTreshold: number
}

export interface IProductFromClient {
	productId: string
	quantity: number
}

export interface IVariantFromClient {
	variantId: string
	productId: string
	quantity: number
}

export interface ISyncState extends Document {
	state: string
	running: boolean
}

export interface IFavourite {
	goods: {
		id: string
		product: IProduct
		variantId?: string
	}[]
}

export interface IFavouriteMethods {
	addGood(productId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<void>
	rmGood(productId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<void>
}

export interface IFavouriteDoc extends Document, IFavouriteMethods {
	goods: {
		product: Types.ObjectId
		variantId?: string
	}[]
}

export interface ICompare {
	id?: any
	goods: {
		id: string
		product: IProduct
		variantId?: string
	}[]
}

export interface ICompareMethods {
	addGood(productId: Types.ObjectId | string, variantId?: Types.ObjectId | string): Promise<void>
	clearGoods(categoryId: Types.ObjectId | string): Promise<void>
	getCategories(): Promise<{ id: string; title: string; length: number }[]>
	getProductsByCategory(categoryId: Types.ObjectId | string): Promise<ICompareReport>
	rmGood(goodId: Types.ObjectId | string): Promise<void>
}

export interface ICompareDoc extends Document, ICompareMethods {
	goods: Types.DocumentArray<{
		product: Types.ObjectId
		variantId?: Types.ObjectId
	}>
}

export interface ICompareReport {
	goods: Product[]
	fields: {
		id: string
		title: string
		values: (string | undefined)[]
	}[]
}

interface IRatingStatics {
	createRating(
		productId: Types.ObjectId | string,
		rating: number,
		variantId?: Types.ObjectId | string,
		deliveryRating?: number,
		text?: string,
		clientId?: Types.ObjectId | string
	): Promise<void>
}

export interface IRating extends IRatingStatics {
	clientId?: Schema.Types.ObjectId
	date: Date
	id: string
	moderated: boolean
	productId: Schema.Types.ObjectId
	rating: number
	deliveryRating?: number
	text?: string
	variantId?: Schema.Types.ObjectId
}

export interface IWzChannel {
	readonly channelId: string
	readonly transport: "whatsapp" | "instagram" | "tgapi"
	readonly plainId: "79865784457"
	readonly state:
		| "active"
		| "init"
		| "disabled"
		| "phoneUnavailable"
		| "qridle"
		| "openelsewhere"
		| "notEnoughMoney"
		| "foreignphone"
		| "unauthorized"
		| "waitForPassword"
}

export interface IWzUser {
	readonly id: string
	readonly ame: string
	readonly phone?: string
}

export interface IWzContact {
	readonly id: string
	readonly responsibleUserId: string
	readonly name: string
	readonly contactData: {
		readonly chatType: "whatsapp" | "instagram" | "tgapi"
		readonly chatId: string
	}[]
	readonly uri?: string
}

export interface IWzDeal {
	readonly id: string
	readonly responsibleUserId: string
	readonly name: string
	readonly closed: boolean
	readonly contacts: string[]
	readonly uri?: string
}

export interface IWzMessage {
	readonly channelId: string
	readonly chatType: "instagram" | "telegram" | "telegroup" | "whatsapp" | "whatsgroup"
	readonly chatId: string
	readonly text?: string
	readonly contentUri?: string
	readonly crmMessageId?: string
}

export interface IWazzup {
	getChannels(): Promise<IWzChannel[] | undefined>
	getUsers(): Promise<IWzUser[] | undefined>
	getContacts(): Promise<IWzContact[] | undefined>
	getDeals?(): Promise<IWzDeal[] | undefined>
	getDealInfo?(dealId: string): Promise<IWzDeal | undefined>
	addContacts?(payload: IWzContact[]): Promise<void>
	updContacts?(payload: IWzContact[]): Promise<void>
	addDeals?(payload: IWzContact[]): Promise<void>
	hookSubscribe?(webhooksUri: string): Promise<void>
	checkHook?(): Promise<any>
}

export interface IAmoChatMessageHookPayload {
	account_id: string
	time: number
	message: {
		conversation: {
			id: string
			client_id: string
		}
		source: { external_id: string }
		sender: { id: string }
		receiver: { id: string }
		timestamp: number
		msec_timestamp: number
		message: {
			id: string
			type: "text" | "file" | "video" | "picture" | "voice" | "audio" | "sticker"
			text: string
			media?: string
			media_group_id: string
			thumbnail?: string
			file_name?: string
		}
	}
}

export interface IAmoChat {
	channelConnect(): Promise<{ scope_id: string } | undefined>
	sendMessage(sid: string, text: string, name?: string): Promise<void>
	getHistory(): Promise<void>
	handleHook(payload: IAmoChatMessageHookPayload): Promise<void>
}

export interface IChatMessage {
	amoContactId?: string
	text: string
}

declare global {
	interface Error {
		userError?: boolean
		sersviceInfo?: string
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
		interface ProcessEnv {
			NODE_ENV?: string
		}
	}
}

declare module "express" {
	function Router(options?: RouterOptions): expressWs.Router
}

declare function expressWs(app: express.Application, server?: http.Server | https.Server, options?: expressWs.Options): expressWs.Instance
declare namespace expressWs {
	type Application = express.Application & WithWebsocketMethod
	type Router = express.Router & WithWebsocketMethod

	interface Options {
		leaveRouterUntouched?: boolean | undefined
		wsOptions?: ws.ServerOptions | undefined
	}

	interface RouterLike {
		get: express.IRouterMatcher<this>
		[key: string]: any
		[key: number]: any
	}

	interface Instance {
		app: Application
		applyTo(target: RouterLike): void
		getWss(): ws.Server
	}

	type WebsocketRequestHandler = (ws: ws, req: express.Request, next: express.NextFunction) => void
	type WebsocketMethod<T> = (route: core.PathParams, ...middlewares: WebsocketRequestHandler[]) => T

	interface WithWebsocketMethod {
		ws: WebsocketMethod<this>
	}
}

declare module "express-session" {
	interface SessionData {
		acceptCookies?: boolean
		isAdmin?: boolean
		cartId: string
		claimedStatus?: string
		compareId?: string
		favouriteId?: string
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
			}
			pickup?: {
				checked: boolean
			}
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
