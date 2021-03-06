import fetch from "node-fetch"
import Moysklad from "moysklad"
import config from 'config'
import { AxiosError } from "axios"

const moyskladCredentails: any = config.get("moysklad")
const organizationId: string = config.get("moyskladOrgId")
const agentnId: string = config.get("moyskladDrobotShopAgentId")
const storeId = config.get<string>("moyskladStoreId")
const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
	order: "entity/customerorder",
	payment: "entity/paymentin",
	demand: "entity/demand",
}

interface IProps {
	city: string
	address?: string
	counterpartyId?: string
	point?: string
	positions: {
		quantity: number
		price: number
		productId?: string
		variantId?: string
	}[]
}

const createMsOrder = async (props: IProps) => {
	try {
		const shipmentAddress = `${props.city} ${props.address && `до двери ${props.address}`} ${props.point && `до ПВЗ ${props.point}`}`
		const positions = props.positions.map(
			({ price, quantity, productId, variantId }) => ({
				quantity, price,
				assortment: {
					meta: {
						href: `https://online.moysklad.ru/api/remap/1.2/entity/${
							productId ? "product" : "variant"
						}/${productId ?? variantId}`,
						type: productId ? "product" : "variant",
						mediaType: "application/json",
					},
				}
			})
		)
		const body = {
			organization: {
				meta: {
					href: `https://online.moysklad.ru/api/remap/1.2/entity/organization/${organizationId}`,
					type: "organization",
					mediaType: "application/json",
				},
			},
			agent: {
				meta: {
					href: `https://online.moysklad.ru/api/remap/1.2/entity/counterparty/${props.counterpartyId || agentnId}`,
					type: "counterparty",
					mediaType: "application/json",
				},
			},
			shipmentAddress, positions
		}
		const order = await ms.POST(paths.order, body)
		return order
	} catch (e) {
		throw e
	}
}

export const updateMsOrder = async (orderId: string, payload: any) => {
	try {
		await ms.PUT(`${paths.order}/${orderId}`, payload)
	}
	catch (e) {
		throw e
	}
}

const createDemand = async (orderId: string) => {
	try {
		const template = await ms.PUT(`${paths.demand}/new`, {
			customerOrder: {
				meta: {
					href: `https://online.moysklad.ru/api/remap/1.2/entity/customerorder/${orderId}`,
					metadataHref:
						"https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata",
					type: "customerorder",
					mediaType: "application/json",
				},
			},
		})
		const store = {
			meta: {
				href: `https://online.moysklad.ru/api/remap/1.2/entity/store/${storeId}`,
				type: "store",
				mediaType: "application/json",
			},
		}
		await ms.POST(paths.demand, { ...template, store })
	}
	catch (e) {
		console.log(e)
	}
}

export const acceptPayment = async (orderId: string, sum: number) => {
	try {
		const order = await ms.GET(`${paths.order}/${orderId}`)
		if ( !order ) {
			throw new Error(`Заказ ${orderId} не найден в Мой склад`)
		}
		const { agent, organization } = order
		const operations = [{
            meta: {
            	href: `https://online.moysklad.ru/api/remap/1.2/entity/customerorder/${orderId}`,
            	metadataHref: "https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata",
            	type: "customerorder",
				mediaType: "application/json"
            }
        }]
		await ms.POST(paths.payment, { agent, operations, organization, sum: sum * 100 })
		await createDemand(orderId)
	}
	catch (e) {
		throw (e)
	}
}

export default createMsOrder