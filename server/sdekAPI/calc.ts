import axios from "axios"
import { ISdekCalcPayload, ISdekCalcResponse } from "../../shared"
import { sdekAuth } from "./auth"

export const sdekCalcDelivery = async (payload: ISdekCalcPayload) => {
    try {
        const url = "	https://api.cdek.ru/v2/calculator/tariff"
	    const Authorization = await sdekAuth()
        return await axios.post<ISdekCalcResponse>(url, payload, {
			headers: { Authorization, "Content-Type": "application/json" },
		})
    }
    catch (e) {
        throw e
    }
}