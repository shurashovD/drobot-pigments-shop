import axios from "axios"
import { ISdekPoints } from "../../shared"
import PointsModel from "../models/PointsModel"
import { sdekAuth } from "./auth"

async function getPoints(): Promise<ISdekPoints[]> {
    try {
        const url = "https://api.edu.cdek.ru/v2/deliverypoints?country_code=RU"
        const Authorization = await sdekAuth()
        const {data} = await axios.get<ISdekPoints[]>(url, {
            headers: { Authorization }
        })
        return data
    }
    catch (e) {
        throw e
    }
}

async function getCity(city_code: number) {
    try {
        const postal = await PointsModel.findOne({ 'location.city_code': city_code })
        if ( !postal ) {
            throw new Error(`Город ${city_code} не найден`)
        }

        return postal.location.city
    }
    catch (e) {
        throw e
    }
}

async function getPointName(code: string) {
	try {
		const postal = await PointsModel.findOne({ code })
		if (!postal) {
			throw new Error(`Офис ${code} не найден`)
		}

		return postal.name
	} catch (e) {
		throw e
	}
}

export { getCity, getPointName, getPoints }