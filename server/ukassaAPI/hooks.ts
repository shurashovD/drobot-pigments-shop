import { YooCheckout, ICreateWebHook } from "@a2seven/yoo-checkout"
import { v4 as uuidv4 } from "uuid"
import config from "config"

const { shopId, secretKey } = config.get("ukassa")
const checkout = new YooCheckout({ shopId, secretKey })

export const createUKHook = async (createWebHookPayload: ICreateWebHook) => {
	try {
        const idempotenceKey = uuidv4()
		await checkout.createWebHook(createWebHookPayload, idempotenceKey)
	} catch (e) {
		throw e
	}
}

export const getUKHooks = async () => {
	try {
		return await checkout.getWebHookList()
	} catch (e) {
		throw e
	}
}

export const deleteUKHooks = async (webHookId: string) => {
	try {
		await checkout.deleteWebHook(webHookId)
	} catch (e) {
		throw e
	}
}

