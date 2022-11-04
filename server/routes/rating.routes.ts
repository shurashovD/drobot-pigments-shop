import { json } from "body-parser";
import { Request, Router } from "express";
import { logger } from "../handlers/errorLogger";
import ClientModel from "../models/ClientModel";
import OrderModel from "../models/OrderModel";
import ProductModel from "../models/ProductModel";
import RatingModel from "../models/RatingModel";

const router = Router()

router.get('/should-rated', async (req, res) => {
    try {
        function notEmpty<Product> (value: Product|undefined|null): value is Product {
            return value !== null && value !== undefined
        }

        const client = await ClientModel.findById(req.session.userId)
        if ( !client ) {
            return res.json([])
        }

        const lastOrder = await OrderModel.findById(client.orders[0])
        const goods = await lastOrder?.getNotRatedGoods()
        const result = goods?.map(async ({ productId, variantId }) => {
            const product = await ProductModel.getProduct(productId?.toString() || "")
            if ( product ) {
                return { ...product, variantId }
            }
        }).filter(notEmpty) || []

        return res.json(result)
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/', json(), async (req: Request<{}, {}, { productId: string, rating: number, variantId?: string, text?: string, deliveryRating?: number }>, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
        if ( !client ) {
            return res.end()
        }

        const { productId, rating, deliveryRating, text, variantId } = req.body
        await RatingModel.createRating(productId, rating, variantId, deliveryRating, text, client._id)
        return res.end()
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

export default router