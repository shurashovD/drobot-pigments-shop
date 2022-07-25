import fetch from "node-fetch"
import config from "config"
import Moysklad from "moysklad"

const moyskladCredentails: any = config.get("moysklad")
const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
	counterparty: "entity/counterparty",
}

export const createMsCounterParty = async (payload: { name: string; email: string; phone: string }) => {
	try {
		const res: { id: string, name: string, phone?: string, email?: string } = await ms.POST(paths.counterparty, payload)
		return res
	} catch (e) {
		throw e
	}
}

const getCounterPartyByNumber = async (phone: string) => {
    const parsePhone = (number: string) => {
		if (number.length < 10) return undefined

		let result = ""
		for (let i = 1; i <= 10; ++i) {
			const symbol = number[number.length - i]
			if (isNaN(parseInt(symbol))) {
				continue
			}
			result += symbol
		}
		return Array.from(result).reverse().join()
	}
    try {
        const { rows } = await ms.GET(paths.counterparty)
        const counterparty:
			| undefined
			| { actualAddress: string, id: string; name: string, phone: string } = rows
			.filter(({ phone }: any) => !!phone)
			.map(({ id, phone }: { id: string; phone: string }) => {
				const tel = parsePhone(phone)
				return { id, phone: tel }
			})
			.find((item: any) => (item.phone === phone))
        return counterparty
    }
    catch (e) {
        throw e
    }
}

export default getCounterPartyByNumber