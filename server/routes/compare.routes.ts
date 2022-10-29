import { json } from "body-parser";
import { Request, Router } from "express";
import { logger } from "../handlers/errorLogger";
import ClientModel from "../models/ClientModel";
import CompareModel from "../models/CompareModel";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
		const compare = await CompareModel.findById(client?.compare || req.session.compareId)
        if ( compare ) {
            const result = compare.goods.map(
                ({ _id, product, variantId }) => ({ id: _id?.toString(), productId: product.toString(), variantId: variantId?.toString() })
            )
            return res.json(result)
        }
		return res.json([])
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get('/categories', async (req, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
        const compare = await CompareModel.findById(client?.compare || req.session.compareId)
        const categories = await compare?.getCategories() || []
        return res.json(categories)
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get("/products-by-category/:id", async (req: Request<{id: string}>, res) => {
	try {
        const { id } = req.params
		const client = await ClientModel.findById(req.session.userId)
		const compare = await CompareModel.findById(client?.compare || req.session.compareId)
		const products = (await compare?.getProductsByCategory(id)) || []
		return res.json(products)
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get("/compare/:firstGoodId/:secondGoodId", async (req: Request<{ firstGoodId: string, secondGoodId: string }>, res) => {
    try {
        const { firstGoodId, secondGoodId } = req.params
        const client = await ClientModel.findById(req.session.userId)
		const compare = await CompareModel.findById(client?.compare || req.session.compareId)
		const report = (await compare?.compare(firstGoodId, secondGoodId)) || { fields: [], goods: [] }
		return res.json(report)
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/good', json(), async (req: Request<{}, {}, { productId: string, variantId?: string }>, res) => {
    try {
        const { productId, variantId } = req.body
        const client = await ClientModel.findById(req.session.userId)
		let compare = await CompareModel.findById(client?.compare || req.session.compareId)
		if ( !compare ) {
            compare = await new CompareModel().save()
            if ( client ) {
                client.compare = compare._id
                await client.save()
            } else {
                req.session.compareId = compare._id.toString()
            }
        }
        await compare.addGood(productId, variantId)
        return res.end()
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: "Что-то пошло не так..." })
    }
})

router.delete("/good/:id", async (req: Request<{id: string}>, res) => {
	try {
		const { id } = req.params
		const client = await ClientModel.findById(req.session.userId)
		const compare = await CompareModel.findById(client?.compare || req.session.compareId)
		if (compare) {
			await compare.rmGood(id)
		}
		return res.end()
	} catch (e) {
		logger.error(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

export default router