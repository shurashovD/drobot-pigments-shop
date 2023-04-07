import fetch from "node-fetch"
import Moysklad from "moysklad"
import config from 'config'
import { IOrder } from "../../shared"

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
		discount?: number 
	}[]
}

function setMsOrderStatus(orderId: string, status: IOrder['status']) {
	try {
		const payload = {
            meta: {
                href: "https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/fb56c504-2e58-11e6-8a84-bae500000069",
                type: "state",
                mediaType: "application/json"
            }
        }
	} catch (e) {
		console.log(e)
		throw e
	}
}

const createMsOrder = async (props: IProps, pickup?: boolean) => {
	try {
		const store = {
			meta: {
				href: `https://online.moysklad.ru/api/remap/1.2/entity/store/${storeId}`,
				type: "store",
				mediaType: "application/json",
			},
		}
		const shipmentAddress = `${props.city} ${props.address && `до двери ${props.address}`} ${props.point && `до ПВЗ ${props.point}`}`
		const positions = props.positions.map(
			({ price, quantity, productId, variantId, discount }) => ({
				quantity, price: price * 100,
				discount: discount || 0,
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
		const body: any = {
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
			shipmentAddress, positions, store
		}
		if ( pickup ) {
			body.state = {
				meta: {
					href: "https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/e17a3e83-3b2e-11ed-0a80-0e67000c4a44",
					type: "state",
					mediaType: "application/json",
				},
			}
		}
		const order = await ms.POST(paths.order, body)
		return order
	} catch (e) {
		throw e
	}
}

export const getMsOrder = async (orderId: string) => {
	try {
		return await ms.GET(`${paths.order}/${orderId}`)
	} catch (e) {
		throw e
	}
}

const getMsOrderPositions = async (orderId: string) => {
	try {
		return await ms.GET(`${paths.order}/${orderId}/positions`)
	} catch (e) {
		throw e
	}
}

const updateMsOrderPosition = async (orderId: string, positionId: string, payload: {}) => {
	try {
		return await ms.PUT(`${paths.order}/${orderId}/positions/${positionId}`, payload)
	} catch (e) {
		throw e
	}
}

export const getMsOrderStatuses = async () => {
	try {
		return await ms.GET(`${paths.order}/metadata`)
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

export const deleteMsOrder = async (orderId: string) => {
	try {
		await ms.DELETE(`${paths.order}/${orderId}`)
	} catch (e) {
		throw e
	}
}

const reserveMsOrderPositions = async (orderId: string) => {
	try {
		const { rows } = await getMsOrderPositions(orderId)
		for (const i in rows) {
			const { id, quantity } = rows[i]
			await updateMsOrderPosition(orderId, id, { reserve: quantity })
		}
 	} catch (e) {
		throw e
	}
}

export const createDemand = async (orderId: string) => {
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
		throw e
	}
}

export const acceptPayment = async (orderId: string, sum: number) => {
	try {
		const order = await ms.GET(`${paths.order}/${orderId}`)
		if (!order) {
			throw new Error(`Заказ ${orderId} не найден в Мой склад`)
		}
		const { agent, organization } = order
		const operations = [
			{
				meta: {
					href: `https://online.moysklad.ru/api/remap/1.2/entity/customerorder/${orderId}`,
					metadataHref: "https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata",
					type: "customerorder",
					mediaType: "application/json",
				},
			},
		]
		await ms.POST(paths.payment, { agent, operations, organization, sum: sum * 100 })
		await reserveMsOrderPositions(orderId)
	}
	catch (e) {
		throw (e)
	}
}

export default createMsOrder