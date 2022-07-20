import axios from 'axios'
import config from 'config'

export const sdekAuth = async () => {
    try {
        const url = "https://api.cdek.ru/v2/oauth/token"
        const { client_id, client_secret } = config.get("sdek")
        if (!global.refreshTokenTime || Date.now() > global.refreshTokenTime - 10000) {
			const { data } = await axios.post<{
				access_token: string
				expires_in: number
			}>(
				url,
				{ client_id, client_secret, grant_type: "client_credentials" },
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			)
			global.sdekToken = data.access_token
			global.refreshTokenTime = Date.now() + data.expires_in * 1000
		}
        
        return `Bearer ${global.sdekToken}`
    }
    catch (e: any) {
        throw e
    }
}