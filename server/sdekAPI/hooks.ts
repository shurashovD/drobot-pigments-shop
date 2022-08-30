import axios from 'axios'
import config from 'config'
import { ISdekCreateWebhookPayload, ISdekWebhookInfo } from '../../shared'
import { sdekAuth } from './auth'

const sdek = config.get<{
	url: string
	client_id: string
	client_secret: string
}>("sdek")

export const getSdekHooks = async () => {
	try {
		const url = `${sdek.url}/webhooks`
		const Authorization = await sdekAuth()
		const res = await axios
			.get<ISdekWebhookInfo[], { data: ISdekWebhookInfo[] }>(url, {
				headers: { Authorization, "Content-Type": "application/json" },
			})
			.then(({ data }) => data)
		return res
	} catch (e) {
		throw e
	}
}

export const createSdekHook = async (payload: ISdekCreateWebhookPayload) => {
    try {
		const url = `${sdek.url}/webhooks`
		const Authorization = await sdekAuth()
		return await axios.post<any, { data: any }, ISdekCreateWebhookPayload>(url, payload, {
			headers: { Authorization, "Content-Type": "application/json" },
		})
	} catch (e) {
		throw e
	}
}

export const deleteSdekHook = async (hookId: string) => {
	try {
		const url = `${sdek.url}/webhooks/${hookId}`
		const Authorization = await sdekAuth()
		return await axios.delete(url, {
			headers: { Authorization, "Content-Type": "application/json" },
		})
	} catch (e) {
		throw e
	}
}