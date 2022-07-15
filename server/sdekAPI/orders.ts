import axios from "axios"
import { ISdekOrderInfo, ISdekOrderPayload, ISdekOrderResponse } from "../../shared"
import { sdekAuth } from "./auth"

export const sdekCreateOrder = async (payload: ISdekOrderPayload) => {
    try {
        const url = "https://api.edu.cdek.ru/v2/orders"
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
        const url = `https://api.edu.cdek.ru/v2/orders/${uuid}`
		const Authorization = await sdekAuth()
		return await axios.get<ISdekOrderInfo>(url, {
			headers: { Authorization },
		})
    }
    catch (e) {
        throw e
    }
}