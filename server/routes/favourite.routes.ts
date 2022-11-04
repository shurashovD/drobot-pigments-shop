import { json } from "body-parser";
import { Request, Router } from "express";
import { IFavourite } from "../../shared";
import { logger } from "../handlers/errorLogger";
import ClientModel from "../models/ClientModel";
import FavouriteModel from '../models/FavouriteModel'

const router = Router()

router.get("/", async (req, res) => {
    try {
		const client = await ClientModel.findById(req.session.userId)
        const favourite = await FavouriteModel.findById(client?.favourite || req.session.favouriteId)
			.populate<{ goods: IFavourite['goods'] }>({ path: 'goods', populate: 'product' })

		console.log(await FavouriteModel.findById(client?.favourite || req.session.favouriteId))

		return res.json(favourite || { goods: [] })
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post("/", json(), async (req: Request<{}, {}, { productId: string, variantId?: string }>, res) => {
    try {
        const { productId, variantId } = req.body

        const client = await ClientModel.findById(req.session.userId)
        let favourite = await FavouriteModel.findById(client?.favourite || req.session.favouriteId)
		if (!favourite) {
			favourite = await new FavouriteModel().save()
			if ( client ) {
				client.favourite = favourite._id.toString()
				await client.save()
			} else {
				req.session.favouriteId = favourite._id.toString()
			}
		}

		await favourite.addGood(productId, variantId)
		return res.end()
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.delete("/", json(), async (req: Request<{}, {}, { productId: string, variantId?: string }>, res) => {
	try {
        const { productId, variantId } = req.body
		const client = await ClientModel.findById(req.session.userId)
		let favourite = await FavouriteModel.findById(client?.favourite || req.session.favouriteId)
		if (favourite) {
			await favourite.rmGood(productId, variantId)
		}
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router