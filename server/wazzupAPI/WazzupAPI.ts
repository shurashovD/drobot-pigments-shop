import axios, { AxiosResponse } from 'axios';
import { IWazzup, IWzChannel, IWzContact, IWzUser } from "../../shared";
import { logger } from '../handlers/errorLogger';

class WazzupAPI implements IWazzup {
	private Authorization
	private urls = {
		channels: "https://api.wazzup24.com/v3/channels",
		users: "https://api.wazzup24.com/v3/users",
		contacts: "https://api.wazzup24.com/v3/contacts",
		deals: "https://api.wazzup24.com/v3/deals",
	}
	private plainId = ""

	constructor(apiKey: string) {
		this.Authorization = `Bearer ${apiKey}`
	}

	public async getChannels(): Promise<IWzChannel[] | undefined> {
		try {
			return await axios
				.get<IWzChannel[], AxiosResponse<IWzChannel[]>>(this.urls.channels, {
					headers: { Authorization: this.Authorization },
				})
				.then((data) => data.data)
		} catch (e) {
			logger.error(e)
		}
	}

	public async getUsers(): Promise<IWzUser[] | undefined> {
		try {
			return await axios
				.get<IWzUser[], AxiosResponse<{ count: number; data: IWzUser[] }>>(this.urls.users, {
					headers: { Authorization: this.Authorization },
				})
				.then((data) => data.data.data)
				.catch((data) => data)
		} catch (e) {
			logger.error(e)
		}
	}

	public async getContacts(): Promise<IWzContact[] | undefined> {
		try {
			return await axios
				.get<IWzContact[], AxiosResponse<{ count: number; data: IWzContact[] }>>(this.urls.contacts, {
					headers: { Authorization: this.Authorization },
				})
				.then((data) => data.data.data)
		} catch (e) {
			logger.error(e)
		}
	}

	public async addContacts(payload: IWzContact[]): Promise<void> {
		try {
			await axios
				.post(this.urls.contacts, payload, {
					headers: { Authorization: this.Authorization },
				})
				.catch((data) => data)
		} catch (e) {
			logger.error(e)
		}
	}

	public async updContacts(payload: IWzContact[]): Promise<void> {
		try {
			await axios
				.post(this.urls.contacts, payload, {
					headers: { Authorization: this.Authorization },
				})
				.catch((data) => data)
		} catch (e) {
			logger.error(e)
		}
	}
}

export default WazzupAPI