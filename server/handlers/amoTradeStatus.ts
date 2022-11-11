import { setTradeStatus } from "../amoAPI/amoApi"

const statuses = {
	invoiceIssued: 41224258,
	invoicePaid: 41224261,
	orderBuilded: 41225170,
	orderShipped: 41225173,
	readyToReceive: 52420267,
	successComplete: 142,
	notCompleteClosed: 143,
}

export const updTradeStatus = async (tradeId: string, status: keyof typeof statuses) => {
	try {
		const statusId = statuses[status]
		if (!statusId) {
			throw new Error(`Статус ${status} не найден. Установка статуса сделки`)
		}
        await setTradeStatus(tradeId, statusId)
	} catch (e) {
		throw e
	}
}