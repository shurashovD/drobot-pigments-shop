import axios, { AxiosRequestHeaders } from 'axios';
import moment from 'moment';
import { logger } from '../handlers/errorLogger';
import { IAmoChat, IAmoChatMessageHookPayload } from './../../shared/index.d';
import config from 'config'
import md5 from 'md5';
import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64'
import AmoCRM, { AmoDTO } from 'amocrm-connector';

const { auth, amojoId, chatAccountId, chatChannelId: chatId, chatScopeId, chatSecret, domain } = config.get("amo")
const { client_id: integrationId, client_secret: secretKey, redirect_uri: redirectUri } = auth

class AmoChatApi implements IAmoChat {
	static _amocrm: AmoCRM | undefined
	private paths = {
		accountId: "/api/v4/users",
	}
	private _domain = domain
	private _chatAccountId = chatAccountId
	private _chatChannelId = chatId
	private _chatScopeId = chatScopeId
	private _conversationId = ""

	private auth(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: string, payload = ""): AxiosRequestHeaders {
		const DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ"
		const date = moment().format(DATE_RFC2822) // текущая дата/время в формате RFC2822;
		const hash = md5(payload)

		const headers: any = {
			"Content-MD5": hash,
			"Content-Type": "application/json",
			Date: date,
		}

		const messageArr = [method.toUpperCase()]
		for (const key in headers) {
			messageArr.push(headers[key])
		}
		messageArr.push(path)
		const message = messageArr.join("n")
		console.log(message)

		const signature = Base64.stringify(CryptoJS.HmacMD5(message, chatSecret))
		headers["X-Signature"] = signature
		return headers
	}

	public async channelConnect(): Promise<{ scope_id: string } | undefined> {
		try {
			if ( !AmoChatApi._amocrm ) {
				return
			}
			
			const scopeId: string|undefined = await AmoChatApi._amocrm.chat.connectChannel(amojoId, "Drobot-pigments-shop")
			if ( scopeId ) {
				return { scope_id: scopeId }
			}
		} catch (e) {
			logger.error(e)
		}
	}

	public async getHistory(): Promise<void> {
		try {
			const path = `/v2/origin/custom/${this._chatScopeId}/chats/${this._conversationId}/history`
		} catch (e) {
			throw e
		}
	}

	public async sendMessage(sid: string, text: string, name = 'Пользователь с сайта'): Promise<void> {
		try {
			if ( !AmoChatApi._amocrm && !chatScopeId ) {
				return
			}
			const payload = {
				date: new Date(),
				conversationId: sid,
				sender: {
					id: sid, name,
				},
				id: "message-id",
				message: {
					type: 'text',
					text,
				},
			}
			type response = {
				new_message: {
					msgid: string,
					ref_id: string
				}
			}
			const data: response = await AmoChatApi._amocrm?.chat.addMessage(chatScopeId, payload)
			console.log(data)
		} catch (e) {
			logger.error(e)
		}
		
		return new Promise(() => {})
	}

	public handleHook(payload: IAmoChatMessageHookPayload): Promise<void> {
		return new Promise(() => {})
	}

	constructor() {
		if ( !AmoChatApi._amocrm ) {
			AmoChatApi._amocrm = new AmoCRM({
				credential: {
					domain, integrationId, secretKey, redirectUri, chatSecret, chatId
				},
			})
		}
		
	}
}

export default AmoChatApi