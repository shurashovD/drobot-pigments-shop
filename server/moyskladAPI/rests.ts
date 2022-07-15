import fetch from "node-fetch"
import Moysklad from "moysklad"
import config from 'config'

const moyskladCredentails: any = config.get("moysklad")
const storeId: string = config.get("moyskladStoreId")
const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
	stock: "report/stock/all/current",
}

const rests = async (filter: { assortmentId: string[] }) => {
	try {
		const result: Promise<{assortmentId: string, stock: number}[]> = await ms.GET(paths.stock, {
			filter: { ...filter, storeId },
		})
		return result 
	} catch (e) {
		throw e
	}
}

export default rests