import axios, { AxiosResponse } from 'axios'
import config from 'config'
import { IAmoAuthCodeExchangePayload, IAmoAuthCodeExchangeResponse, IAmoCreateTaskPayload, IAmoPipeline, IAmoRefreshTokenPayload, IAmoRefreshTokenResponse, IAmoTag } from '../../shared'
import AmoContactModel from '../models/AmoContactModel'
import AmoCredModel from '../models/AmoCredModel'

const { auth, contact, domain, pipelineId } = config.get("amo")

const paths = {
	oauth: "/oauth2/access_token",
	amojoId: '/api/v4/account?with=amojo_id',
	catalogs: "/api/v4/catalogs",
	contacts: "/api/v4/contacts",
	contactsCustomFields: "/api/v4/contacts/custom_fields",
	pipelines: "/api/v4/leads/pipelines",
	trade: "/api/v4/leads",
	tasks: "/api/v4/tasks",
}

export const amoGetToken = async (code: string) => {
    try {
        const { access_token, expires_in, refresh_token, token_type } =
            await axios.post<IAmoAuthCodeExchangeResponse, AxiosResponse<IAmoAuthCodeExchangeResponse>, IAmoAuthCodeExchangePayload>(
				`${domain}/${paths.oauth}`,
				{
					client_id: auth.client_id,
					client_secret: auth.client_secret,
					code,
					grant_type: "authorization_code",
					redirect_uri: auth.redirect_uri,
				},
				{ headers: { "Content-Type": "application/json" } }
			).then(({ data }) => data)

        const amoCred = await AmoCredModel.findOne()
        if ( amoCred ) {
            amoCred.access_token = access_token
            amoCred.expires_in = Math.round(Date.now() / 1000) + expires_in
            amoCred.refresh_token = refresh_token
            amoCred.token_type = token_type
            await amoCred.save()
        } else {
            await new AmoCredModel({
                expires_in: Math.round(Date.now() / 1000) + expires_in,
                access_token, refresh_token, token_type
            }).save()
        }
    }
    catch (e) {
        throw e
    }
}

const getAmoProducts = async () => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const url = `${domain}${paths.catalogs}/3961/elements`
		return await axios
			.get(url, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) =>
				data?._embedded.elements
			)
	} catch (e) {
		throw e
	}
}

const amoRefreshToken = async (refresh_token: string) => {
	try {
		const res = await axios.post<IAmoRefreshTokenResponse, any, IAmoRefreshTokenPayload>(
			`${domain}/${paths.oauth}`,
			{
                client_id: auth.client_id,
                client_secret: auth.client_secret,
                grant_type: 'refresh_token',
                redirect_uri: auth.redirect_uri,
                refresh_token
            },
			{ headers: { "Content-Type": "application/json" } }
		).then(({ data }) => data)
        const amoCred = await AmoCredModel.findOne()
		if (amoCred) {
			amoCred.access_token = res.access_token
			amoCred.expires_in = Math.round(Date.now() / 1000) + res.expires_in
			amoCred.refresh_token = res.refresh_token
			amoCred.token_type = res.token_type
			await amoCred.save()
		} else {
			await new AmoCredModel({
				expires_in: Math.round(Date.now() / 1000) + res.expires_in,
				access_token: res.access_token,
				refresh_token: res.refresh_token,
				token_type: res.token_type,
			}).save()
		}
	} catch (e) {
		throw e
	}
}

const amoAuth = async () => {
    try {
        const amoCred = await AmoCredModel.findOne()
        if ( !amoCred ) {
            return
        }
        if ( amoCred.expires_in < Math.round(Date.now() / 1000 - 15) ) {
            await amoRefreshToken(amoCred.refresh_token)
            const newAmoCred = await AmoCredModel.findOne()
            if ( !newAmoCred ) {
                return
            }
            return `${newAmoCred.token_type} ${newAmoCred.access_token}`
        }
        return `${amoCred.token_type} ${amoCred.access_token}`
    }
    catch (e: any) {
        console.log(e.response?.data)
        throw e
    }
}

export const getAmojoId = async () => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const url = `${domain}${paths.amojoId}`
		return await axios
			.get(url, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) =>
				data
			)
	} catch (e) {
		throw e
	}
}

export const createContact = async (name = 'Покупатель с сайта', phone?: string, mail?: string, city?: string) => {
    try {
        const payload: {
			name: string
			custom_fields_values: {
				field_id: number
				values: { value: string }[]
			}[]
		}[] = [
			{
				name,
				custom_fields_values: [
					{
						field_id: 331359,
                        values: [{
                            value: 'drobot-pigments-shop.ru'
                        }]
					},
				],
			},
		]

        if ( phone ) {
            payload[0].custom_fields_values.push({
				field_id: 329649,
                values: [{
                    value: phone
                }]
			})
        }

        if (mail) {
			payload[0].custom_fields_values.push({
				field_id: 329651,
				values: [
					{
						value: mail,
					},
				],
			})
		}

        if (city) {
			payload[0].custom_fields_values.push({
				field_id: 331409,
				values: [
					{
						value: city,
					},
				],
			})
		}

        const authorization = await amoAuth()
        if ( !authorization ) {
            return
        }

        return await axios
			.post(`${domain}${paths.contacts}`, payload, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data._embedded?.contacts?.[0])
    }
    catch (e: any) {
        console.log(e.response?.data?.['validation-errors']?.[0])
    }
}

export const updateContact = async (id: string, name = 'Покупатель с сайта', phone?: string, mail?: string, city?: string) => {
    try {
        const payload: {
			name: string
			custom_fields_values: {
				field_id: number
				values: { value: string }[]
			}[]
		}[] = [
			{
				name,
				custom_fields_values: [
					{
						field_id: 331359,
                        values: [{
                            value: 'drobot-pigments-shop.ru'
                        }]
					},
				],
			},
		]

        if ( phone ) {
            payload[0].custom_fields_values.push({
				field_id: 329649,
                values: [{
                    value: phone
                }]
			})
        }

        if (mail) {
			payload[0].custom_fields_values.push({
				field_id: 329651,
				values: [
					{
						value: mail,
					},
				],
			})
		}

        if (city) {
			payload[0].custom_fields_values.push({
				field_id: 331409,
				values: [
					{
						value: city,
					},
				],
			})
		}

        const authorization = await amoAuth()
        if ( !authorization ) {
            return
        }

        return await axios
			.patch(`${domain}${paths.contacts}/${id}`, payload, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data?._embedded?.contacts?.[0]?.id)
    }
    catch (e: any) {
        throw e
    }
}

export const getContactByPhone = async (phone: string) => {
    try {
		const reg = /^\d+$/
		const parsePhone = (number: string) => {
			return number
				.split("")
				.filter((item) => reg.test(item))
				.join("")
		}

        const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const number = parsePhone(phone)
		const contact = await AmoContactModel.findOne({ number })
		if ( contact ) {
			const url = `${domain}${paths.contacts}/${contact.amoContactId}`
			const data = await axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
						authorization,
					},
				})
				.then(({ data }) => data)
			return data
		}
		parseContacts()
    }
    catch (e) {
        throw e
    }
}

export const parseContacts = async () => {
	try {
		const reg = /^\d+$/
		const parsePhone = (number: string) => {
			return number
				.split("")
				.filter((item) => reg.test(item))
				.join("")
		}

        const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		let page = 1
		const contacts = []
		while (true) {
			try {
				const url = `${domain}${paths.contacts}?page=${page}&limit=250`
				const data = await axios.get(url, { headers: { "Content-Type": "application/json", authorization } })
					.then(({ data }) => data?._embedded?.contacts)
				if (data.length > 0) {
					++page
					const phones = data.map(({ id, custom_fields_values }: any) => {
						const phone = custom_fields_values?.find(({ field_id, values }: any) => ( field_id === 329649 ) && values?.length > 0)
						if ( phone ) {
							return { amoContactId: id, number: parsePhone(phone.values[0].value) }
						}
					}).filter((item: any) => !!item)
					contacts.push(...phones)
				} else {
					break
				}
			} catch (e) {
				console.log(e)
				break
			}
		}
		try {
			await AmoContactModel.insertMany(contacts)
		} catch (e) {}
	} catch (e) {
		console.log(e)
	}
}

export const getPipelines = async (id?: string) => {
    try {
        const authorization = await amoAuth()
		if (!authorization) {
			return
		}

        if ( id ) {
            const url = `${domain}${paths.pipelines}/${id}`
            return await axios.get<IAmoPipeline, AxiosResponse<IAmoPipeline>>(url, {
                headers: { "Content-Type": "application/json", authorization },
            }).then(({ data }) => data)
        } else {
            const url = `${domain}${paths.pipelines}`
            return await axios.get<IAmoPipeline[], AxiosResponse<{_embedded: { pipelines: IAmoPipeline[] }}>>(url, {
                headers: { "Content-Type": "application/json", authorization },
            }).then(({ data }) => data._embedded.pipelines)
        }
        
    }
    catch (e) {
        throw e
    }
}

export const getPipelineStatuses = async (id: string) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const url = `${domain}${paths.pipelines}/${id}/statuses`
		return await axios
			.get<IAmoTag, AxiosResponse<{ _embedded: any }>>(url, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data._embedded)
	} catch (e) {
		throw e
	}
}

export const getLeadsTags = async (page = 1) => {
    try {
        const authorization = await amoAuth()
		if (!authorization) {
			return
		}

        const url = `${domain}${paths.trade}/tags?page=${page}`
		return await axios
			.get<IAmoTag, AxiosResponse<{ _embedded: { tags: IAmoTag[] }}>>(url, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data._embedded.tags)
    }
    catch (e) {
        throw e
    }
}

const getContactById = async (id: number) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}
		const url = `${domain}${paths.contacts}/${id}`
		return await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				authorization,
			},
		}).then(({ data }) => data)
	} catch (e) {
		throw e
	}
}

export const getTradeFields = async (page = 1) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		return await axios
			.get(`${domain}${paths.trade}/custom_fields?page=${page}`, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data._embedded.custom_fields)
	} catch (e) {
		throw e
	}
}

export const createTrade = async (
	contactId: number,
	products: { name: string; quantity: number }[],
	price: number,
	number?: string,
	paymentUrl?: string,
	deliveryType?: "sdek" | "pickup"
) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const custom_fields_values = [
			{
				field_id: 986327,
				values: [{ value: products.reduce((str, { name, quantity }) => `${str} ${name} ${quantity}шт.;`, "") }],
			},
		]

		if (number) {
			custom_fields_values.push({
				field_id: 996789,
				values: [{ value: number.toString() }],
			})
		}

		if (paymentUrl) {
			custom_fields_values.push({
				field_id: 996787,
				values: [{ value: paymentUrl }],
			})
		}

		const _embedded: any = {
			contacts: [{ id: contactId }],
		}

		if ( deliveryType ) {
			let id = 266367
			if ( deliveryType === 'sdek' ) {
				id = 266369
			}
			_embedded.tags = [{ id }]
		}

		const status_id = 41224258 // выставлен счёт;

		const payload = [
			{
				custom_fields_values,
				price,
				pipeline_id: pipelineId,
				status_id,
				_embedded
			},
		]

		return await axios
			.post(`${domain}${paths.trade}`, payload, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data)
	} catch (e: any) {
		console.log(e.response.data["validation-errors"][0].errors)
		throw e.response.data["validation-errors"][0].errors
	}
}

export const setTradeSdekTrackId = async (tradeId: string, track: string) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}
		
		const custom_fields_values = [
			{
				field_id: 996945,
				values: [{ value: track }],
			},
		]

		const payload = { custom_fields_values }

		const result = await axios
			.patch(`${domain}${paths.trade}/${tradeId}`, payload, {
				headers: { "Content-Type": "application/json", authorization },
			}).then(({ data }) => data)
		return result
	} catch (e: any) {
		console.log(e.response.data["validation-errors"][0].errors)
		throw e
	}
}

export const setTradeStatus = async (tradeId: string, statusId: number) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const payload = { status_id: statusId }

		return await axios
			.patch(`${domain}${paths.trade}/${tradeId}`, payload, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data)
	} catch (e: any) {
		throw e
	}
}

export const createTask = async (text: string, contactId?: number) => {
	try {
		const authorization = await amoAuth()
		if (!authorization) {
			return
		}

		const created_at = Math.round(Date.now() / 1000)
		const complete_till = created_at + 2 * 3600
		const payload: IAmoCreateTaskPayload[] = [{
			created_at, complete_till, text,
			entity_id: contactId,
			entity_type: "contacts",
		}]

		return await axios
			.post(`${domain}${paths.tasks}`, payload, {
				headers: { "Content-Type": "application/json", authorization },
			})
			.then(({ data }) => data)
	} catch (e: any) {
		throw e
	}
}