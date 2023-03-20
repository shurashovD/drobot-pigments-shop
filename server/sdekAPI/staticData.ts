import { SdekCitiesModel } from './../models/SdekCitiesModel';
import axios from "axios"
import config from 'config'
import { ISdekCities, ISdekPoints } from "../../shared"
import PointsModel from "../models/PointsModel"
import { sdekAuth } from "./auth"

const sdek = config.get<{
	url: string
	client_id: string
	client_secret: string
}>("sdek")

async function getPoints(): Promise<ISdekPoints[]> {
    try {
        const url = `${sdek.url}/deliverypoints?country_codes=BY,GE,KZ,KG,RU,TJ,TM,UZ`
        const Authorization = await sdekAuth()
        const {data} = await axios.get<ISdekPoints[]>(url, {
            headers: { Authorization }
        })
		console.log(data.length)
        return data
    }
    catch (e) {
        throw e
    }
}

export async function getCities() {
	try {
		const size = 500
		const result = []
		const Authorization = await sdekAuth()
		for (let page = 0; ; ++page) {
			const url = `${sdek.url}/location/cities/?country_codes=BY,GE,KZ,KG,RU,TJ,TM,UZ&size=${size}&page=${page}`
			console.log(url)
			try {
				const { data } = await axios.get<ISdekCities[]>(url, {
					headers: { Authorization },
				})
				console.log(data[0]?.city)
				if ( data.length === 0 ) {
					break
				}
				result.push(...data)
			}
			catch(e) {
				break
			}
		}
		
		return result
	} catch (e) {
		throw e
	}
}

async function getCity(code: number) {
    try {
        const city = await SdekCitiesModel.findOne({ code })
        if (!city) {
			throw new Error(`Город ${code} не найден`)
		}
        return city.city
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