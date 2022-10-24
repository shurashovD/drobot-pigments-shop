import axios from 'axios';
import config from 'config'

const auth = async () => {
    try {
        const { url, cred } = config.get("plusofon")
        const res = await axios.post(url, cred, {
			headers: { "Content-Type": "multipart/form-data" },
		}).then(({ data }) => data)
        global.plusofonToken = res.result.access_token
    }
    catch (e) {
        throw (e)
    }
}

export const checkNumber = async (phone: string) => {
    try {
        if (!global.plusofonToken) {
            await auth()
        }
        const body = {
			jsonrpc: "2.0",
			method: "TFA/call",
			id: "1",
			params: { number: `${phone}` },
		}
        const url = 'https://new-api.plusofon.ru'
        const authorization = `Bearer ${global.plusofonToken}`
        const res = await axios
			.post(url, body, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(data => data)
        return res.data.result
    }
    catch (e) {
        throw (e)
    }
}

export const checkPin = async (key: string, pin: string) => {
    try {
        if (!global.plusofonToken) {
			await auth()
		}
		const body = {
			jsonrpc: "2.0",
			method: "TFA/check",
			id: "1",
			params: { key, pin },
		}
		const url = "https://new-api.plusofon.ru"
		const authorization = `Bearer ${global.plusofonToken}`
		const res = await axios
			.post(url, body, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data)
        return res.result
    }
    catch (e) {
        throw e
    }
}