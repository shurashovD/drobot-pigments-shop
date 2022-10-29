import bodyParser from 'body-parser';
import { Request, Router } from "express"
import { amoGetToken } from '../amoAPI/amoApi';
import { logger } from '../handlers/errorLogger';
import setMsOrderStatus from '../handlers/setMsOrderStatus';
import AmoCredModel from '../models/AmoCredModel';
import OrderModel from "../models/OrderModel"

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
		logger.error(e)
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
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/handle', bodyParser.urlencoded({ extended: false }), async (req, res) => {
    try {
        const tradeId = req.body['leads[status][0][id]']
        const statusId = req.body["leads[status][0][status_id]"]
        if ( tradeId && statusId ) {
            res.end()
        } else {
            res.status(400)
        }
        const order = await OrderModel.findOne({ tradeId })
        if ( !order ) {
            return
        }

        if ( statusId === '41224258' ) {
            order.status = 'new'
            if ( order.msOrderId ) {
                await setMsOrderStatus(order.msOrderId, 'new')
            }
        }
        if (statusId === "41224261") {
            order.status = "compiling"
            if ( order.msOrderId ) {
                await setMsOrderStatus(order.msOrderId, "builded")
            }
		}
        if (statusId === "41225170") {
            order.status = "builded"
            if ( order.msOrderId ) {
                await setMsOrderStatus(order.msOrderId, "builded")
            }
		}
        if (statusId === "41225173") {
            order.status = "dispatch"
            if ( order.msOrderId ) {
                await setMsOrderStatus(order.msOrderId, "dispatch")
            }
		}
        if (statusId === "142") {
            order.status = "complete"
		}
        if (statusId === "143") {
            order.status = "canceled"
            if ( order.msOrderId ) {
                await setMsOrderStatus(order.msOrderId, "canceled")
            }
		}
    }
    catch (e) {
        logger.error(e)
    }
})

export default router