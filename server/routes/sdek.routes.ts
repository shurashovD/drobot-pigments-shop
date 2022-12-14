import { getPoints } from './../sdekAPI/staticData';
import { Request, Router } from "express";
import PointsModel from '../models/PointsModel';
import { createSdekHook, deleteSdekHook, getSdekHooks } from '../sdekAPI/hooks';
import { json } from 'body-parser';
import { ISdekCreateWebhookPayload, ISdekWebhookPayload } from '../../shared';
import OrderModel from '../models/OrderModel';
import { updateMsOrder } from '../moyskladAPI/orders';
import { logger } from '../handlers/errorLogger';
import setMsOrderStatus from '../handlers/setMsOrderStatus';
import { updTradeStatus } from '../handlers/amoTradeStatus';

const router = Router()

router.post('/update-pvz', async (req, res) => {
    try {
        const points = await getPoints()
        const pointsInDb = await PointsModel.find()

        const deletedIds = pointsInDb.filter(({ code }) => !points.some(item => item.code === code)).map(({ _id }) => _id)
        await PointsModel.deleteMany({ _id: { $in: deletedIds } })

        for (const i in points) {
            const point = points[i]
            const pointInDb = pointsInDb.find(({ code }) => code === point.code)?._id
            if ( pointInDb ) {
                await PointsModel.findByIdAndUpdate(pointInDb, point)
            }
            else {
                await new PointsModel(point).save()
            }
        }

        return res.end()
    }
    catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get('/hooks', async (req, res) => {
    try {
        const hooks = await getSdekHooks()
        return res.json(hooks)
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post("/hooks", json(), async (req: Request<{}, {}, ISdekCreateWebhookPayload>, res) => {
	try {
		await createSdekHook(req.body)
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.delete("/hooks/:id", async (req: Request<{id: string}>, res) => {
	try {
        const { id } = req.params
		await deleteSdekHook(id)
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.post('/handle/order', async (req: Request<{}, {}, ISdekWebhookPayload>, res) => {
    try {
        const { attributes, uuid } = req.body
        const order = await OrderModel.findOne({ 'delivery.sdek.uuid': uuid })
        if ( !order ) {
            return res.end()
        }

        const { code } = attributes
        if ( code === 'INVALID' ) {
            logger.error(attributes)
        }
        if ( code === 'СREATED' || code === 'RECEIVED_AT_SENDER_WAREHOUSE' || 'READY_TO_SHIP_AT_SENDING_OFFICE' ) {
            order.status = "delivering"
            if ( order.msOrderId ) {
                await setMsOrderStatus(order.msOrderId, 'delivering')
            }
            if (order.tradeId) {
				await updTradeStatus(order.tradeId, "orderShipped")
			}
        }
        if ( code === 'ISSUED_FOR_DELIVERY' || code === 'ACCEPTED_AT_WAREHOUSE_ON_DEMAND' ) {
            order.status = 'ready'
            if (order.tradeId) {
				await updTradeStatus(order.tradeId, "readyToReceive")
			}
        }
        if (code === "DELIVERED" || code === "POSTOMAT_RECEIVED") {
			order.status = "complete"
			if (order.tradeId) {
				await updTradeStatus(order.tradeId, 'successComplete')
			}
		}

        await order.save()

        if ( order.msOrderId && order.status === 'delivering' ) {
            const payload = {
				state: {
					meta: {
						href: "https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/644e2da9-ed66-11ec-0a80-0185000dc96c",
						type: "state",
						mediaType: "application/json",
					},
				},
			}
			await updateMsOrder(order.msOrderId, payload)
        }

        if (order.msOrderId && order.status === "complete") {
			const payload = {
				state: {
					meta: {
						href: "https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/a3ab577e-f494-11e8-9ff4-34e80005d6b3",
						type: "state",
						mediaType: "application/json",
					},
				},
			}
			await updateMsOrder(order.msOrderId, payload)
		}
        
        return res.end()
    } catch (e) {
        logger.error(e)
        return res.end()
    }
})

export default router