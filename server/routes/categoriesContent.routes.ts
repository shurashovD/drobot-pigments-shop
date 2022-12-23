import { json } from 'body-parser';
import { Router, Request } from 'express';
import { access, mkdir } from 'fs/promises';
import multer, { diskStorage } from 'multer';
import path from 'path';
import { logger } from '../handlers/errorLogger';
import CategoryContentModel from '../models/CategoryContentModel';

const router = Router()

const storage = diskStorage({
	destination: async (req, file, cb) => {
		const { contentId } = req.params
		const dirPath = path.join(__dirname, "static", "content", contentId, "carousel")
		try {
			await access(dirPath)
		} catch {
			try {
				await mkdir(dirPath, { recursive: true })
			} catch (e) {
				console.log(e)
				throw e
			}
		}
		cb(null, dirPath)
	},
	filename: (req, file, cb) => {
		const filename = Date.now() + path.extname(file.originalname)
		cb(null, filename)
	},
})

const carouselImageUpload = multer({ storage })

router.post("/:categoryId", async (req: Request<{ categoryId: string }>, res) => {
    try {
        const { categoryId } = req.params
        await CategoryContentModel.createContent(categoryId)
		return res.end()
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.get("/:categoryId", async (req: Request<{ categoryId: string }>, res) => {
    try {
        const { categoryId } = req.params
        const content = await CategoryContentModel.findOne({ categoryId })
        return res.json(content)
    } catch (e) {
        logger.error(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post("/add-carousel-image/:contentId", carouselImageUpload.single('image'), async (req: Request<{ contentId: string }>, res) => {
	try {
		const { contentId } = req.params

        const filename = req.file?.filename
        if ( filename ) {
            const content = await CategoryContentModel.findById(contentId)
            if ( !content ) {
                return res.status(500).json({ message: 'Контент категории не найден' })
            }
            const path = `/static/content/${contentId}/carousel/${filename}`
            content.addImage(path)
            return res.end()
        }
        return res.status(500).json({ message: 'Ошибка сохранения изображения' })
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

router.post("/set-video-url/:contentId", json(), async (req: Request<{ contentId: string }, {}, { url: string }>, res) => {
	try {
		const { contentId } = req.params
        const content = await CategoryContentModel.findById(contentId)
        if (!content) {
            return res.status(500).json({ message: "Контент категории не найден" })
        }
        const { url } = req.body
        content.addVideo(url)
        return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

router.post("/add-sidebarlink/:contentId", json(), async (req: Request<{ contentId: string}, {}, { text: string, href?: string, to?: string }>, res) => {
    try {
        const { contentId } = req.params
        const content = await CategoryContentModel.findById(contentId)
        if (!content) {
			return res.status(500).json({ message: "Контент категории не найден" })
		}
        const { text, href, to } = req.body
        await content.addSideBarLink(text, href, to)
        return res.end()
    } catch (e: any) {
        logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

router.put("/update-slide-info/:contentId", json(), async (req: Request<{ contentId: string }, {}, { imageId: string; href?: string; to?: string }>, res) => {
		try {
			const { contentId } = req.params
			const content = await CategoryContentModel.findById(contentId)
			if (!content) {
				return res.status(500).json({ message: "Контент категории не найден" })
			}
			const { imageId, href, to } = req.body
			await content.updImage(imageId, href, to)
			return res.end()
		} catch (e: any) {
			logger.error(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

router.put(
	"/update-sidebarlink/:contentId",
	json(),
	async (req: Request<{ contentId: string }, {}, { linkId: string, text?: string; href?: string; to?: string }>, res) => {
		try {
			const { contentId } = req.params
			const content = await CategoryContentModel.findById(contentId)
			if (!content) {
				return res.status(500).json({ message: "Контент категории не найден" })
			}
			const { linkId, text, href, to } = req.body
			await content.updSideBarLink(linkId, text, href, to)
			return res.end()
		} catch (e: any) {
			logger.error(e)
			const message = e.userError ? e.message : "Что-то пошло не так..."
			return res.status(500).json({ message })
		}
	}
)

router.put("/sort-carousel/:contentId", json(), async (req: Request<{ contentId: string }, {}, { order: string[] }>, res) => {
	try {
        const { contentId } = req.params
		const content = await CategoryContentModel.findById(contentId)
		if (!content) {
			return res.status(500).json({ message: "Контент категории не найден" })
		}

        const { order } = req.body
        await content.sortImages(order)
        return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

router.put("/sort-sidebar/:contentId", json(), async (req: Request<{ contentId: string }, {}, { order: string[] }>, res) => {
	try {
		const { contentId } = req.params
		const content = await CategoryContentModel.findById(contentId)
		if (!content) {
			return res.status(500).json({ message: "Контент категории не найден" })
		}

        const { order } = req.body
		await content.sortSideBarLinks(order)
		return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

router.delete("/slide/:contentId", json(), async (req: Request<{ contentId: string }, {}, { imageId: string }>, res) => {
    try {
        const { contentId } = req.params
        const content = await CategoryContentModel.findById(contentId)
        if (!content) {
			return res.status(500).json({ message: "Контент категории не найден" })
		}

        const { imageId } = req.body
        await content.rmImage(imageId)
        return res.end()
    } catch (e: any) {
        logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
    }
})

router.delete("/sidebar-link/:contentId", json(), async (req: Request<{ contentId: string }, {}, { linkId: string }>, res) => {
	try {
		const { contentId } = req.params
		const content = await CategoryContentModel.findById(contentId)
		if (!content) {
			return res.status(500).json({ message: "Контент категории не найден" })
		}

		const { linkId } = req.body
		await content.rmSideBarLink(linkId)
		return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

router.delete("/video/:contentId", json(), async (req: Request<{ contentId: string }, {}, { url: string }>, res) => {
	try {
		const { contentId } = req.params
		const content = await CategoryContentModel.findById(contentId)
		if (!content) {
			return res.status(500).json({ message: "Контент категории не найден" })
		}

		const { url } = req.body
		await content.rmVideo(url)
		return res.end()
	} catch (e: any) {
		logger.error(e)
		const message = e.userError ? e.message : "Что-то пошло не так..."
		return res.status(500).json({ message })
	}
})

export default router