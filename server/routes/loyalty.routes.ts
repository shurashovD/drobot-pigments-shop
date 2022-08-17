import { json } from 'body-parser';
import { Router, Request } from 'express';
import errorHandler from '../handlers/errorLogger'
import AgentDiscountModel from '../models/AgentDiscountModel';
import CommonDiscountModel from '../models/CommonDiscountModel';
import DelegateDiscountModel from '../models/DelegateDiscountModel';

const router = Router()

router.post("/common", json(), async (req: Request<{}, {}, { percentValue: number; lowerTreshold: number }>, res) => {
	try {
        const { lowerTreshold, percentValue } = req.body
		await new CommonDiscountModel({ lowerTreshold, percentValue }).save()
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.get('/common', async (req, res) => {
    try {
        const commonDiscounts = await CommonDiscountModel.find().sort({ lowerTreshold: 1 })
            .then(doc => doc.map((item) => ({ ...item.toObject(), id: item._id.toString() })))
        return res.json(commonDiscounts)
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.put("/common/:id", json(), async (req: Request<{id: string}, {}, { percentValue: number; lowerTreshold: number }>, res) => {
	try {
        const { id } = req.params
		const { lowerTreshold, percentValue } = req.body
		await CommonDiscountModel.findByIdAndUpdate(id, { lowerTreshold, percentValue })
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.delete("/common/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const { id } = req.params
		await CommonDiscountModel.findByIdAndRemove(id)
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.post("/agent", json(), async (req: Request<{}, {}, { percentValue: number }>, res) => {
	try {
		const { percentValue } = req.body
		const agentDiscount = await AgentDiscountModel.findOne()
		if ( agentDiscount ) {
			agentDiscount.percentValue = percentValue
			await agentDiscount.save()
		} else {
			await new AgentDiscountModel({ percentValue }).save()
		}
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.get("/agent", async (req, res) => {
	try {
		const agentDiscount = await AgentDiscountModel.findOne()
			.then((doc) => {
				if ( !doc ) return doc
				return { ...doc.toObject(), id: doc._id.toString() }
			})
		return res.json(agentDiscount)
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.delete("/agent", async (req, res) => {
	try {
		await AgentDiscountModel.deleteMany()
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.post("/delegate", json(), async (req: Request<{}, {}, { percentValue: number; lowerTreshold: number }>, res) => {
	try {
		const { lowerTreshold, percentValue } = req.body
		await new DelegateDiscountModel({ lowerTreshold, percentValue }).save()
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.get("/delegate", async (req, res) => {
	try {
		const delegateDiscounts = await DelegateDiscountModel.find()
			.sort({ lowerTreshold: 1 })
			.then((doc) => doc.map((item) => ({ ...item.toObject(), id: item._id.toString() })))
		return res.json(delegateDiscounts)
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.put("/delegate/:id", json(), async (req: Request<{ id: string }, {}, { percentValue: number; lowerTreshold: number }>, res) => {
	try {
		const { id } = req.params
		const { lowerTreshold, percentValue } = req.body
		await DelegateDiscountModel.findByIdAndUpdate(id, { lowerTreshold, percentValue })
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

router.delete("/delegate/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const { id } = req.params
		await DelegateDiscountModel.findByIdAndRemove(id)
		return res.end()
	} catch (e: any) {
		errorHandler(e, req, res)
	}
})

export default router