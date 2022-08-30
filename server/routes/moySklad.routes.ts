import { oneVariantCreate, oneVariantUpdate } from './../moyskladAPI/synchronization';
import { ReqIdModel } from './../models/ReqIdModel';
import { createHook, enableHook, deleteHook, disableHook, getHooks } from './../moyskladAPI/hooks';
import bodyParser from 'body-parser';
import { Request, Router } from "express";
import { Types } from "mongoose";
import ProductModel from "../models/ProductModel";
import CatalogModel from "../models/CatalogModel";
import { currencySync, oneProductCreate, oneProductDelete, oneProductFolderDelete, oneVariantDelete, oneProductFolderSync, oneProductFolderUpdate, oneProductUpdate, productFolderSync, productSync, uomSync, variantSync } from "../moyskladAPI/synchronization"
import { IMSHook, IOrder } from "../../shared";
import { getMsOrder } from '../moyskladAPI/orders';
import OrderModel from '../models/OrderModel';

const router = Router()

router.get("/folder", async (req, res) => {
	try {
		const catalogs = await CatalogModel.find({
			archived: false,
			parent: { $exists: false },
		})
		const products = await ProductModel.find({
			archived: false,
			parent: { $exists: false },
		})
		return res.json({ catalogs, products })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get("/folder-free-products", async (req, res) => {
	try {
		const catalogs = await CatalogModel.find({
			archived: false,
			parent: { $exists: false },
		})
		const products = await ProductModel.find({
			archived: false,
			parent: { $exists: false },
		})
		return res.json({ catalogs, products })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get('/folder-free-products/:id', async (req: Request<{id: string}, {}, {}>, res) => {
    try {
        const { id } = req.params
		const catalog = await CatalogModel.findById(id)
		if (!catalog) {
			return res.status(500).json({ message: 'Папка не найдена в БД "Мой склад"' })
		}

        const catalogs = await CatalogModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
		})
        const products = await ProductModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
			parentCategory: { $exists: false }
		})
		return res.json({ catalog, catalogs, products })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Что-то пошло не так..." })
    }
})


router.get("/folder/:id", async (req: Request<{ id: string }, {}, {}>, res) => {
	try {
		const { id } = req.params
		const catalog = await CatalogModel.findById(id)
		if (!catalog) {
			return res
				.status(500)
				.json({ message: 'Папка не найдена в БД "Мой склад"' })
		}

		const catalogs = await CatalogModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
		})
		const products = await ProductModel.find({
			archived: false,
			parent: new Types.ObjectId(id),
		})
		return res.json({ catalog, catalogs, products })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Что-то пошло не так..." })
	}
})

router.get('/sync', async (req, res) => {
    try {
        await currencySync()
		console.log("Валюта синхронизирована")
        await uomSync()
		console.log("Измерения синхронизированы")
        await productFolderSync()
		console.log('Папки синхронизированы');
        await productSync()
		console.log('Продукты синхронизированы');
		await variantSync()
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})


router.get('/hooks', async (req, res) => {
	try {
		const hooks = await getHooks()
		return res.json(hooks)
	}
	catch (e) {
		console.log(e)
	}
})

router.post("/hooks", bodyParser.json(), async (req: Request<{}, {}, { payload: IMSHook }>, res) => {
	try {
		const { payload } = req.body
		await createHook(payload)
		return res.end()
	} catch (e) {
		console.log(e)
	}
})

router.put("/hooks/enable/:id", async (req: Request<{id: string}>, res) => {
	try {
		const { id } = req.params
		await enableHook(id)
		return res.end()
	} catch (e) {
		console.log(e)
	}
})

router.put("/hooks/disable/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const { id } = req.params
		await disableHook(id)
		return res.end()
	} catch (e) {
		console.log(e)
	}
})

router.delete("/hooks/:id", async (req: Request<{ id: string }>, res) => {
	try {
		const { id } = req.params
		await deleteHook(id)
		return res.end()
	} catch (e) {
		console.log(e)
	}
})


router.post(
	"/handle/productfolder/create",
	bodyParser.json(),
	async (req: Request<{}, {}, { events: any[] }, { requestId: string}>, res) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if ( cursor ) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneProductFolderSync(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post(
	"/handle/productfolder/update",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if (cursor) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneProductFolderUpdate(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post(
	"/handle/productfolder/delete",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if (cursor) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneProductFolderDelete(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post(
	"/handle/product/create",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if (cursor) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneProductCreate(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post(
	"/handle/product/update",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if (cursor) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneProductUpdate(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post(
	"/handle/product/delete",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if (cursor) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneProductDelete(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post(
	"/handle/variant/create",
	bodyParser.json(),
	async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
		try {
			const { events } = req.body
			const { requestId } = req.query
			res.end()
			const cursor = await ReqIdModel.findOne({ requestId })
			if (cursor) {
				return
			}

			await new ReqIdModel({ requestId }).save()

			for (const i in events) {
				await oneVariantCreate(events[i].meta.href)
			}
			return
		} catch (e) {
			console.log(e)
			return res.end()
		}
	}
)

router.post("/handle/variant/update", bodyParser.json(), async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
	try {
		const { events } = req.body
		const { requestId } = req.query
		res.end()
		const cursor = await ReqIdModel.findOne({ requestId })
		if (cursor) {
			return
		}

		await new ReqIdModel({ requestId }).save()

		for (const i in events) {
			await oneVariantUpdate(events[i].meta.href)
		}
		return
	} catch (e) {
		console.log(e)
		return res.end()
	}
})

router.post("/handle/variant/delete", bodyParser.json(), async (
		req: Request<{}, {}, { events: any[] }, { requestId: string }>,
		res
	) => {
	try {
		const { events } = req.body
		const { requestId } = req.query
		res.end()
		const cursor = await ReqIdModel.findOne({ requestId })
		if (cursor) {
			return
		}

		await new ReqIdModel({ requestId }).save()

		for (const i in events) {
			await oneVariantDelete(events[i].meta.href)
		}
		return
	} catch (e) {
		console.log(e)
		return res.end()
	}
})

router.post("/handle/customerorder/update", bodyParser.json(), async (req: Request<{}, {}, { events: any[] }, { requestId: string }>, res) => {
	try {
		const { events } = req.body
		const { requestId } = req.query
		res.end()
		const cursor = await ReqIdModel.findOne({ requestId })
		if (cursor) {
			return
		}

		await new ReqIdModel({ requestId }).save()

		for (const i in events) {
			if (events[i].updatedFields.includes("state")) {
				const msOrderId = events[i].meta.href.split('/').pop()
				const msOrder = await getMsOrder(msOrderId)
				const statusId = msOrder.state.meta.href.split('/').pop()
				let status: IOrder['status'] | undefined
				if ( statusId === 'a3ab517a-f494-11e8-9ff4-34e80005d6af' ) {
					status = "compiling"
				}
				if (statusId === "a3ab53d5-f494-11e8-9ff4-34e80005d6b0") {
					status = "builded"
				}
				if (statusId === "a3ab5662-f494-11e8-9ff4-34e80005d6b2") {
					status = "dispatch"
				}
				if (statusId === "a3ab5836-f494-11e8-9ff4-34e80005d6b4") {
					status = "return"
				}
				if (statusId === "a3ab58e1-f494-11e8-9ff4-34e80005d6b5" || statusId === "70dc899b-ee2a-11ec-0a80-07c8000b5983") {
					status = "canceled"
				}
				if ( typeof status !== 'undefined' ) {
					const order = await OrderModel.findOne({ msOrderId })
					if ( order ) {
						order.status = status
					}
				}
			}
		}
		return
	} catch (e) {
		console.log(e)
		return res.end()
	}
})

export default router