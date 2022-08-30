import fetch, { Headers } from "node-fetch"
import config from "config"
import Moysklad from "moysklad"
import { IMSHook } from "../../shared"

const moyskladCredentails: any = config.get("moysklad")
const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
	webhook: "entity/webhook",
}

export const getHooks = async () => {
    try {
        const hooks = await ms.GET(paths.webhook)
        return hooks.rows as IMSHook[]
    }
    catch (e) {
        console.log(e)
        throw e
    }
}

export const createHook = async (payload: IMSHook) => {
	try {
		await ms.POST({ path: paths.webhook, payload: { ...payload, diffType: "FIELDS" } })
		return true
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const enableHook = async (hookId: string) => {
	try {
		const payload = { enabled: true }
		await ms.PUT({ path: `${paths.webhook}/${hookId}`, payload })
		return true
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const disableHook = async (hookId: string) => {
	try {
		const payload = { enabled: false }
		await ms.PUT({ path: `${paths.webhook}/${hookId}`, payload })
		return true
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const deleteHook = async (hookId: string) => {
	try {
		await ms.DELETE(`${paths.webhook}/${hookId}`)
		return true
	} catch (e) {
		console.log(e)
		throw e
	}
}