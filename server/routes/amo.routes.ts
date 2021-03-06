import bodyParser from 'body-parser';
import { Request, Router } from "express"
import { amoGetToken } from '../amoAPI/amoApi';
import AmoCredModel from '../models/AmoCredModel';

const router = Router()

router.get("/check-auth", async (req, res) => {
	try {
        const formatter = Intl.DateTimeFormat('ru', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
		const amoCred = await AmoCredModel.findOne()
        const tokenIsActual = amoCred && (Math.round(Date.now() / 1000 - 15) < amoCred.expires_in)
        const message = tokenIsActual
			? `Ключ интеграции с АМО актуален до ${formatter.format(
					new Date(amoCred.expires_in * 1000)
			  )}`
			: "Отсутсвует актуальный ключ для интеграции с АМО"
		return res.json({ message, tokenIsActual })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post('/auth', bodyParser.json(), async (req: Request<{}, {}, {code: string}>, res) => {
    try {
        const { code } = req.body
        await amoGetToken(code)
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get('/handle', async (req, res) => {
    try {
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.end()
    }
})

export default router