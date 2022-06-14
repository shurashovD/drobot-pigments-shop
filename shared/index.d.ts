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
		address?: string
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

declare global {
	interface Error {
		userError?: boolean
	}
}

declare module 'express-session' {
	interface SessionData {
		isAdmin: boolean
	}
}

declare module "*.svg" {

	export const ReactComponent: FC<SVGProps<SVGSVGElement> & { title?: string }>

	const src: string
	export default src
}