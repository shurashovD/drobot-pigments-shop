import axios from "axios"
import config from "config"
import { ISdekOrderInfo, ISdekOrderPayload, ISdekOrderResponse } from "../../shared"
import { sdekAuth } from "./auth"

const sdek = config.get<{
	url: string
	client_id: string
	client_secret: string
}>("sdek")

export const sdekCreateOrder = async (payload: ISdekOrderPayload) => {
    try {
        const url = `${sdek.url}/orders`
		const Authorization = await sdekAuth()
        const res = await axios
			.post<ISdekOrderResponse>(url, payload, {
				headers: { Authorization, "Content-Type": "application/json" },
			})
			.then(({ data }) => data.entity?.uuid)
        return res
    }
    catch (e) {
        throw e
    }
}

export const sdekGetOrderInfo = async (uuid: string) => {
    try {
        const url = `${sdek.url}/orders/${uuid}`
		const Authorization = await sdekAuth()
		return await axios.get<ISdekOrderInfo>(url, {
			headers: { Authorization },
		})
    }
    catch (e) {
        throw e
    }
}