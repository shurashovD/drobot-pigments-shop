import { YooCheckout, ICreatePayment } from "@a2seven/yoo-checkout"
import { v4 as uuidv4 } from "uuid"
import config from 'config'

const { shopId, secretKey } = config.get('ukassa')
const checkout = new YooCheckout({ shopId, secretKey })

export const createUKPayment = async (createPayload: ICreatePayment) => {
	try {
		const idempotenceKey = uuidv4()
		const { confirmation, id } = await checkout.createPayment(createPayload, idempotenceKey)
        return { url: confirmation.confirmation_url, id }
	} catch (e) {
		throw e
	}
}