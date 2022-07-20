import axios, { AxiosResponse } from 'axios'
import config from 'config'
import { IAmoAuthCodeExchangePayload, IAmoAuthCodeExchangeResponse, IAmoRefreshTokenPayload, IAmoRefreshTokenResponse } from '../../shared'
import AmoCredModel from '../models/AmoCredModel'

const { auth, domain } = config.get("amo")

const paths = {
	oauth: "/oauth2/access_token",
	contacts: "/api/v4/contacts",
	contactsCustomFields: "/api/v4/contacts/custom_fields",
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

export const amoRefreshToken = async (refresh_token: string) => {
	try {
		await axios.post<IAmoRefreshTokenResponse, any, IAmoRefreshTokenPayload>(
			`${domain}/${paths.oauth}`,
			{
                client_id: auth.client_id,
                client_secret: auth.client_secret,
                grant_type: 'refresh_token',
                redirect_uri: auth.redirect_uri,
                refresh_token
            },
			{ headers: { "Content-Type": "application/json" } }
		)
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
			.then(({ data }) => data?._embedded?.contacts?.[0]?.id)
    }
    catch (e: any) {
        console.log(e.response?.data?.['validation-errors']?.[0])
    }
}