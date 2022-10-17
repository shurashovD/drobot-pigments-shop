import axios from "axios"
import config from "config"
import { ISdekCalcPayload, ISdekCalcResponse } from "../../shared"
import { sdekAuth } from "./auth"

const sdek = config.get<{
	url: string
	client_id: string
	client_secret: string
}>("sdek")

export const sdekCalcDelivery = async (payload: ISdekCalcPayload) => {
    try {
        console.log('Запрос');
        const url = `${sdek.url}/calculator/tariff`
	    const Authorization = await sdekAuth()
        return await axios.post<ISdekCalcResponse>(url, payload, {
			headers: { Authorization, "Content-Type": "application/json" },
		})
    }
    catch (e) {
        throw e
    }
}