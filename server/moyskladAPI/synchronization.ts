import { IProduct, IProductImage } from "./../../shared/index.d"
import fetch, { Headers } from 'node-fetch'
import config from 'config'
import Moysklad from "moysklad"
import CurrencyModel from '../models/CurrencyModel'
import UomModel from '../models/UomModel'
import CatalogModel from '../models/CatalogModel'
import ProductModel from '../models/ProductModel';
import { access, mkdir, open, readdir, rm } from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { logger } from '../handlers/errorLogger';

type PhotoInfoType = {
	downloadHref: string
	filename: string
	miniature: string
	updated: string
}

const moyskladCredentails: any = config.get("moysklad")
const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
	assortiment: "entity/assortment",
	currency: "entity/currency",
	product: "entity/product",
	productFolder: "entity/productfolder",
	token: "security/token",
	varaint: "entity/variant",
	uom: "entity/uom",
}

// получает информацию о изображениях товара или модификации из МС;
async function getPhotosInfo(imagesHref: string): Promise<PhotoInfoType[]|undefined> {
	try {
		const images = await ms.GET(imagesHref)
		return images.rows.map(({ meta, filename, miniature, updated }: any) => ({
			downloadHref: meta.href,
			filename,
			miniature: miniature.href,
			updated,
		}))
	} catch (e) {
		logger.error(e)
	}
}

// удаляет фотографии;
async function rmPhotos(photoPaths: string[]): Promise<void> {
	if (typeof photoPaths === 'string') {
		const p = path.join(__dirname, photoPaths)
		try {
			await access(p)
			await rm(p, { recursive: true })
		} catch (e) {}
		return
	}
		for (const i in photoPaths) {
			const p = path.join(__dirname, photoPaths[i])
			try {
				await access(p)
				await rm(p, { recursive: true })
			} catch (e) {
				continue
			}
		}
}

// нужно ли обновлять фотографии;
function shouldDownloadPhoto(photos: PhotoInfoType[], ptoductImages: IProductImage[]): boolean {
	return photos.some(({ filename, updated }) => !ptoductImages?.some(item => (item.filename === filename && item.updated === updated)))
}

// скачивает фотографию;
const downloadPhoto = async (props: { Authorization: string, photo: string, id: string, updated?: string }) => {
	try {
		const { Authorization, id, photo } = props
		const image = await ms.GET(photo)
		if ( !image ) {
			return { filename: null, updated: null }
		}
		
		const downloadUrl = image.meta.downloadHref
		const filename = image.filename
		const updated = image.updated
		if ( updated === props.updated ) {
			return { filename, updated }
		}
		const res = await fetch(downloadUrl, {
			redirect: "follow",
			headers: new Headers({
				Authorization,
			}),
		}).then((res) => {
			if (res.redirected) {
				return fetch(res.url)
			}
		})
		if (res) {
			const dirPath = path.join(__dirname, 'static', 'img', id)
			const filePath = path.join(dirPath, filename)
			try {
				await access(dirPath)
				/*const files = await readdir(dirPath)
				for ( const i in files ) {
					try {
						await rm(path.join(dirPath, files[i]))
					} catch(e) {
						console.log("Ошибка удаления файла")
						throw e
					}
				}*/
				try {
					const fd = await open(filePath, 'w')
					await fd.close()
				} catch (e) {
					console.log('Ошибка создания шаблона файла');
					throw e
				}
			}
			catch {
				try {
					await mkdir(dirPath, { recursive: true })
					const fd = await open(filePath, "w")
					await fd.close()
				}
				catch (e) {
					console.log('Ошибка создания папки')
					throw e
				}
			}
			const fileStream = createWriteStream(filePath)
			await new Promise((resolve, reject) => {
				res.body.pipe(fileStream)
				res.body.on("error", reject)
				fileStream.on("finish", resolve)
			})
		}
		return { filename, updated }
	}
	catch (e) {
		throw e
	}
}

export const currencySync = async () => {
    try {
        const currency = await ms.GET(paths.currency)
        for ( let i in currency.rows ) {
            const { id, name, fullName, isoCode } = currency.rows[i]
            const cursor = await CurrencyModel.findOne({ identifier: { $eq: id } })
            if ( cursor ) {
                cursor.name = name
                cursor.fullName = fullName
                cursor.isoCode = isoCode
                await cursor.save()
            }
            else {
                await new CurrencyModel({
					identifier: id,
					name,
					fullName,
					isoCode,
				}).save()
            }
        }
    }
    catch (e) {
        console.log(e)
		throw e
    }
}

export const uomSync = async () => {
	try {
		const uom = await ms.GET(paths.uom)
		for (let i in uom.rows) {
			const { id, name, description } = uom.rows[i]
            const cursor = await UomModel.findOne({
				identifier: { $eq: id },
			})
			if (cursor) {
				cursor.name = name
                cursor.description = description
				await cursor.save()
			} else {
				await new UomModel({ identifier: id, name, description }).save()
			}
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const productFolderSync = async () => {
	const getLevel = function(arr: any[], item: any, level = 0): number {
		if (!item.parentId) return level
		return getLevel(
			arr,
			arr.find((el) => el.id === item.parentId),
			++level
		)
	}
	try {
		const folders = await ms.GET(paths.productFolder)
		const rows = folders.rows.map(
			({ id, archived, name, productFolder}: any) => ({
				id,
				archived,
				name,
				parentId: productFolder?.meta.href.split("/").pop(),
			})
		)
		const sortRows = rows.sort(
			(a: any, b: any) => getLevel(rows, b) - getLevel(rows, a)
		)

		const categories = await CatalogModel.find()

		// удаление категорий, не содержащихся в "Мой склад";
		const deletedIdentifier = categories.map(({ identifier }) => identifier)
			.filter((item: string) => sortRows.every(({ id }: any) => id !== item))
		await CatalogModel.deleteMany({
			identifier: { $in: deletedIdentifier },
		})

		// добавление категорий, не содержащихся в БД;
		const identifierInDB = categories.map(({ identifier }) => identifier)
		const addedRows = sortRows.filter(({ id }: any) =>
			identifierInDB.every((item: string) => item !== id)
		)
		for (let i in addedRows) {
			const { id, archived, name, parentId } = addedRows[i]
			const parent = await CatalogModel.findOne({
				identifier: { $eq: parentId },
			})
			if (parent) {
				await new CatalogModel({
					identifier: id,
					archived,
					name,
					parent: parent._id,
				}).save()
			} else {
				await new CatalogModel({ identifier: id, archived, name }).save()
			}
		}

		// обновление данных из "Мой склад";
		for (let i in sortRows) {
			const { id, archived, name, parentId } = sortRows[i]
			const parent = await CatalogModel.findOne({
				identifier: { $eq: parentId },
			})
			if (parent) {
				await CatalogModel.findOneAndUpdate(
					{ identifier: { $eq: id } },
					{ archived, name, parent: parent._id }
				)
			} else {
				await CatalogModel.findOneAndUpdate(
					{ identifier: { $eq: id } },
					{ archived, name }
				)
				await CatalogModel.findOneAndUpdate(
					{ identifier: { $eq: id } },
					{ $unset: { parent: true } }
				)
			}
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const productSync = async () => {
    try {
		const goods = await ms.GET(paths.product)
		const Authorization = ms.getAuthHeader()
		
		const normalize = goods.rows.map(
			({
				id,
				archived,
				description,
				images,
				name,
				productFolder,
				salePrices,
				uom,
				weight,
			}: any) => ({
				id,
				archived,
				description,
				name,
				price: salePrices[0].value,
				weight,
				parentId: productFolder?.meta.href.split("/").pop(),
				currency: salePrices[0].currency.meta.href.split("/").pop(),
				photo: images?.meta?.href,
				uom: uom?.meta.href.split("/").pop(),
			})
		)

		const products = await ProductModel.find()
		const categories = await CatalogModel.find()
		const currencies = await CurrencyModel.find()
		const uoms = await UomModel.find()

		// удаление продуктов, не содержащихся в "Мой склад";
		console.log("Удаление продуктов")
		const deletedIdentifier = products
			.map(({ identifier }: IProduct) => identifier)
			.filter((item: string) =>
				normalize.every(({ id }: any) => id !== item)
			)
		for (const i in deletedIdentifier) {
			const identifier = deletedIdentifier[i]
			let product
			try {
				product = await ProductModel.findOneAndDelete({ identifier })
			}
			catch (e) {
				console.log(identifier)
				throw e
			}
			if ( product?.photo[0] ) {
				try {
					await rm(path.resolve(__dirname, product.photo[0]), { recursive: true })
				}
				catch (e) {
					console.log(e)
				}
			}
		}
		console.log("Удаление продуктов завершено")

		// добавление продуктов, не содержащихся в БД;
		const addedRows = normalize.filter(({ id }: any) =>
			products.every(({ identifier }: IProduct) => identifier !== id)
		)
		for (let i in addedRows) {
			console.log(i, addedRows.length);
			const item = addedRows[i]
			const {
				archived,
				description,
				id,
				name,
				parentId,
				photo,
				price,
				weight,
			} = item
			const currency = currencies.find(
				({ identifier }) => identifier === item.currency
			)
			const parent = categories.find(
				({ identifier }) => identifier === parentId
			)?._id
			const uom = uoms.find(({ identifier }) => identifier === item.uom)

			let product
			if (parent) {
				product = await new ProductModel({
					archived,
					currency,
					description,
					identifier: id,
					name,
					parent,
					price,
					uom,
					weight,
				}).save()
			} else {
				product = await new ProductModel({
					archived,
					currency,
					identifier: id,
					name,
					price,
					uom,
					weight,
				}).save()
			}
			if (photo && product) {
				const photos = await getPhotosInfo(photo)
				if ( photos ) {
					product.photo = []
					product.images = []
					for ( const i in photos ) {
						const photoUrl = photos[i].downloadHref
						const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id: product._id?.toString() || "" })
						if (filename && updated) {
							const { filename, miniature, updated } = photos[i]
							product.photo.push(`/static/img/${product._id?.toString()}/${filename}`)
							product.images.push({ filename, miniature, updated })
							await product.save()
						}
					}
				}
			}
		}
		console.log('Добавление продуктов завешено')

		// обновление измененных продуктов;
		console.log('Обновление продуктов');
		for (let i in normalize) {
			console.log(i, normalize.length);
			const item = normalize[i]
			const {
				archived,
				description,
				id,
				name,
				parentId,
				photo,
				price,
				weight,
			} = item
			const currency = currencies.find(({ identifier }) => identifier === item.currenc)
			const parent = categories.find(({ identifier }) => identifier === parentId)?._id
			const uom = uoms.find(({ identifier }) => identifier === item.uom)
			const product = await ProductModel.findOne({identifier: { $eq: id }})
			if ( product ) {
				product.archived = archived
				if ( currency ) {
					product.currency = currency._id
				}
				product.description = description
				product.name = name
				if (parent) {
					product.parent = parent._id
				}
				product.price = price
				if ( uom ) {
					product.uom = uom._id
				}
				product.weight = weight
				if ( photo ) {
					const photos = await getPhotosInfo(photo)
					if (photos && shouldDownloadPhoto(photos, product.images)) {
						await rmPhotos(product.photo)
						product.photo = []
						product.images = []
						for (const i in photos) {
							const photoUrl = photos[i].downloadHref
							const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id: product._id?.toString() || "" })
							if (filename && updated) {
								const { filename, miniature, updated } = photos[i]
								product.photo.push(`/static/img/${product._id?.toString()}/${filename}`)
								product.images.push({ filename, miniature, updated })
								await product.save()
							}
						}
					}
				}
				await product.save()
			}
		}
		console.log('Обновление продуктов завершено');
	}
    catch (e) {
        console.log(e)
		throw e 
    }
}

export const variantSync = async () => {
    try {
        const variants = await ms.GET(paths.varaint)
		const Authorization = ms.getAuthHeader()
		const normalize = variants.rows.map((item: any) => ({
			identifier: item.id,
			name: item.name,
			photo: item.images?.meta?.href,
			price: item.salePrices[0].value,
			productId: item.product.meta.href.split('/').pop(),
			value: item.characteristics[0].value,
			variantsLabel: item.characteristics[0].name
		}))

		const products = await ProductModel.find({ archived: false })

		// удаление вариантов;
		for ( const i in products ) {
			const rmIds = []
			const product = products[i]
			for ( const i in product.variants ) {
				const variant = product.variants[i]
				const removeFlag = !normalize.some(({ identifier }: any) => variant.identifier === identifier)
				if ( removeFlag ) {
					rmIds.push(variant._id?.toString())
				}
			}
			for ( const i in rmIds ) {
				const id = rmIds[i]
				const index = product.variants.findIndex(({ _id }) => id === _id?.toString())
				if ( index !== -1 ) {
					for (const i in product.variants[index].photo) {
						try {
							await rm(path.resolve(__dirname, product.variants[index].photo[i]), { recursive: true })
						} catch (e) {
							console.log(e)
						}
					}
					product.variants.splice(index, 1)
					await product.save()
				}
			}
			if ( product.variants.length === 0 ) {
				await ProductModel.findByIdAndUpdate(product._id, { $unset: { variantsLabel: true } })
			}
		}

		// добавление и обновление вариантов;
		for (const i in normalize) {
			console.log(normalize.length, i)
			const mod = normalize[i]
			const product = await ProductModel.findOne({
				identifier: mod.productId,
			})
			if ( !product ) {
				console.log(`Товар ${mod.productId} не найден`)
				continue
			}

			if (product.variantsLabel !== mod.variantsLabel) {
				product.variantsLabel = mod.variantsLabel
			}

			const index = product.variants.findIndex(({ identifier }) => identifier === mod.identifier)
			if ( index === -1 ) {
				product.variants.push({
					identifier: mod.identifier,
					name: mod.name,
					price: mod.price,
					value: mod.value
				})
			}
			else {
				product.variants[index].name = mod.name
				product.variants[index].price = mod.price
				product.variants[index].value = mod.value
			}
			await product.save()
			
			const ind = product.variants.findIndex(({ identifier }) => identifier === mod.identifier)
			if ( ind !== -1 && mod.photo ) {
				const photos = await getPhotosInfo(mod.photo)
				if (photos && shouldDownloadPhoto(photos, mod.images)) {
					await rmPhotos(mod.photo)
					product.variants[ind].photo = []
					product.variants[ind].images = []
					console.log(photos.length)
					for (const i in photos) {
						const photoUrl = photos[i].downloadHref
						const id = product.variants[ind]._id?.toString() || ''
						const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id })
						if (filename && updated) {
							const { filename, miniature, updated } = photos[i]
							product.variants[ind].photo.push(`/static/img/${product.variants[ind]._id?.toString()}/${filename}`)
							product.variants[ind].images.push({ filename, miniature, updated })
						}
					}
					await product.save()
				}
			}
		}
	}
	catch (e) {
		console.log(e)
		throw e
	}
}

export const oneProductFolderSync = async (href: string) => {
	try {
		const folders = await ms.GET(`${paths.productFolder}/${href}`)
		const row = folders.rows.map(
			({ id, archived, name, productFolder }: any) => ({
				id,
				archived,
				name,
				parentId: productFolder?.meta.href.split("/").pop(),
			})
		)[0]

		const cursor = await CatalogModel.findOne({ identifier: { $eq: row.id } })
		if ( cursor ) {
			return
		}

		// добавление категории в БД;
		const { id, archived, name, parentId } = row
		const parent = await CatalogModel.findOne({
			identifier: { $eq: parentId },
		})
		if (parent) {
			await new CatalogModel({
				identifier: id,
				archived,
				name,
				parent: parent._id,
			}).save()
		} else {
			await new CatalogModel({
				identifier: id,
				archived,
				name,
			}).save()
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneProductFolderUpdate = async (href: string) => {
	try {
		const folders = await ms.GET(`${paths.productFolder}/${href}`)
		const row = folders.rows.map(
			({ id, archived, name, productFolder }: any) => ({
				id,
				archived,
				name,
				parentId: productFolder?.meta.href.split("/").pop(),
			})
		)[0]

		const cursor = await CatalogModel.findOne({
			identifier: { $eq: row.id },
		})
		if (!cursor) {
			return
		}

		// обновление категории в БД;
		const { archived, name, parentId } = row
		const parent = await CatalogModel.findOne({
			identifier: { $eq: parentId },
		})
		cursor.archived = archived
		cursor.name = name
		if (parent) {
			cursor.parent = parent._id
		}
		await cursor.save()
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneProductFolderDelete = async (href: string) => {
	try {
		const folders = await ms.GET(`${paths.productFolder}/${href}`)
		const row = folders.rows.map(
			({ id, archived }: any) => ({
				id,
				archived
			})
		)[0]

		const cursor = await CatalogModel.findOne({
			identifier: { $eq: row.id },
		})
		if (!cursor) {
			return
		}

		// обновление категории в БД;
		const { archived } = row
		cursor.archived = archived
		await cursor.save()
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneProductCreate = async (href: string) => {
	try {
		console.log('Создание товара', href);
		const good: any = await ms.GET(href)
		const Authorization = ms.getAuthHeader()

		console.log(good);
		const normalize = {
			id: good.id,
			archived: good.archived,
			description: good.description,
			name: good.name,
			price: good.salePrices[0].value,
			weight: good.weight,
			parentId: good.productFolder?.meta.href.split("/").pop(),
			currency: good.salePrices[0].currency.meta.href.split("/").pop(),
			photo: good.images?.meta?.href,
			uom: good.uom?.meta.href.split("/").pop(),
		}

		const cursor = await ProductModel.findOne({
			identifier: { $eq: normalize.id },
		})
		if (cursor) {
			return
		}
		const categories = await CatalogModel.find()
		const currencies = await CurrencyModel.find()
		const uoms = await UomModel.find()

		// добавление продуктов, не содержащихся в БД;
		const item = normalize
		const {
			archived,
			description,
			id,
			name,
			parentId,
			photo,
			price,
			weight,
		} = item
		const currency = currencies.find(
			({ identifier }) => identifier === item.currency
		)
		const parent = categories.find(
			({ identifier }) => identifier === parentId
		)?._id
		const uom = uoms.find(({ identifier }) => identifier === item.uom)

		let product
		if (parent) {
			product = await new ProductModel({
				archived,
				currency,
				description,
				identifier: id,
				name,
				parent,
				price,
				uom,
				weight,
			}).save()
		} else {
			product = await new ProductModel({
				archived,
				currency,
				identifier: id,
				name,
				price,
				uom,
				weight,
			}).save()
		}
		if (photo && product) {
			const photos = await getPhotosInfo(photo)
			if (photos) {
				product.photo = []
				product.images = []
				for (const i in photos) {
					const photoUrl = photos[i].downloadHref
					const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id: product._id?.toString() || "" })
					if (filename && updated) {
						const { filename, miniature, updated } = photos[i]
						product.photo.push(`/static/img/${product._id?.toString()}/${filename}`)
						product.images.push({ filename, miniature, updated })
						await product.save()
					}
				}
			}
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneProductUpdate = async (href: string) => {
	try {
		console.log('Обновление товара', href);
		const good: any = await ms.GET(href)
		const Authorization = ms.getAuthHeader()

		console.log(good);

		const normalize = {
			id: good.id,
			archived: good.archived,
			description: good.description,
			name: good.name,
			price: good.salePrices[0].value,
			weight: good.weight,
			parentId: good.productFolder?.meta.href.split("/").pop(),
			currency: good.salePrices[0].currency.meta.href.split("/").pop(),
			photo: good.images?.meta?.href,
			uom: good.uom?.meta.href.split("/").pop(),
		}

		const cursor = await ProductModel.findOne({
			identifier: { $eq: normalize.id },
		})
		if (!cursor) {
			return
		}
		const categories = await CatalogModel.find()
		const currencies = await CurrencyModel.find()
		const uoms = await UomModel.find()

		// изменение продуктов в БД;
		const item = normalize
		const {
			archived,
			description,
			id,
			name,
			parentId,
			photo,
			price,
			weight,
		} = item
		const currency = currencies.find(
			({ identifier }) => identifier === item.currency
		)
		const parent = categories.find(
			({ identifier }) => identifier === parentId
		)?._id
		const uom = uoms.find(({ identifier }) => identifier === item.uom)
		const product = await ProductModel.findOne({
			identifier: { $eq: id },
		})
		if ( product ) {
			product.archived = archived
			if (currency) {
				product.currency = currency._id
			}
			product.description = description
			product.name = name
			if (parent) {
				product.parent = parent._id
			}
			product.price = price
			if (uom) {
				product.uom = uom._id
			}
			product.weight = weight
			await rmPhotos(product.photo)
			product.photo = []
			product.images = []
			if (photo) {
				const photos = await getPhotosInfo(photo)
				if (photos && shouldDownloadPhoto(photos, product.images)) {
					for (const i in photos) {
						const photoUrl = photos[i].downloadHref
						const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id: product._id?.toString() || "" })
						if (filename && updated) {
							const { filename, miniature, updated } = photos[i]
							product.photo.push(`/static/img/${product._id?.toString()}/${filename}`)
							product.images.push({ filename, miniature, updated })
							await product.save()
						}
					}
				}
			}
			await product.save()
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneProductDelete = async (href: string) => {
	try {
		console.log('Удаление товара', href);
		const goods = await ms.GET(href)

		const id = goods.rows.map(({ id }: any) => (id))[0]

		const cursor = await ProductModel.findOne({
			identifier: { $eq: id },
		})
		if (!cursor) {
			return
		}
		const product = await ProductModel.findByIdAndDelete(id)
		if ( product ) {
			await rmPhotos(product.photo)
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneVariantCreate = async (href: string) => {
	try {
		console.log('Создание модификации', href);
		const variants = await ms.GET(href)
		const Authorization = ms.getAuthHeader()

		console.log(variants);
		const normalize = variants.map((item: any) => ({
			identifier: item.id,
			name: item.name,
			photo: item.images?.meta?.href,
			price: item.salePrices[0].value,
			productId: item.product.meta.href.split("/").pop(),
			value: item.characteristics[0].value,
			variantsLabel: item.characteristics[0].name,
		}))[0]

		const mod = normalize
		const product = await ProductModel.findOne({
			identifier: mod.productId,
		})
		if (!product) {
			console.log(`Товар ${mod.productId} не найден`)
			return
		}

		if (product.variantsLabel !== mod.variantsLabel) {
			product.variantsLabel = mod.variantsLabel
		}

		const index = product.variants.findIndex(
			({ identifier }) => identifier === mod.identifier
		)
		if (index === -1) {
			product.variants.push({
				identifier: mod.identifier,
				name: mod.name,
				price: mod.price,
				value: mod.value,
			})
		}
		await product.save()

		const ind = product.variants.findIndex(
			({ identifier }) => identifier === mod.identifier
		)
		if (ind !== -1 && mod.photo) {
			const photos = await getPhotosInfo(mod.photo)
			if (photos && shouldDownloadPhoto(photos, mod.images)) {
				product.variants[ind].photo = []
				product.variants[ind].images = []
				for (const i in photos) {
					const photoUrl = photos[i].downloadHref
					const id = product.variants[ind]._id?.toString() || ""
					const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id })
					if (filename && updated) {
						const { filename, miniature, updated } = photos[i]
						product.variants[ind].photo.push(`/static/img/${product.variants[ind]._id?.toString()}/${filename}`)
						product.variants[ind].images.push({ filename, miniature, updated })
						await product.save()
					}
				}
			}
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneVariantUpdate = async (href: string) => {
	try {
		console.log("Обновление модификации", href)
		const variant = await ms.GET(href)
		const Authorization = ms.getAuthHeader()
		console.log(variant)
		const normalize = {
			identifier: variant.id,
			name: variant.name,
			photo: variant.images?.meta?.href,
			price: variant.salePrices[0].value,
			productId: variant.product.meta.href.split("/").pop(),
			value: variant.characteristics[0].value,
			variantsLabel: variant.characteristics[0].name,
		}

		const mod = normalize
		const product = await ProductModel.findOne({
			identifier: mod.productId,
		})
		if (!product) {
			console.log(`Товар ${mod.productId} не найден`)
			return
		}

		if (product.variantsLabel !== mod.variantsLabel) {
			product.variantsLabel = mod.variantsLabel
		}

		const index = product.variants.findIndex(
			({ identifier }) => identifier === mod.identifier
		)
		if (index !== -1) {
			product.variants[index].name = mod.name
			product.variants[index].price = mod.price
			product.variants[index].value = mod.value
		}
		await product.save()

		const ind = product.variants.findIndex(
			({ identifier }) => identifier === mod.identifier
		)
		if (ind !== -1 && mod.photo) {
			const photos = await getPhotosInfo(mod.photo)
			if (photos && shouldDownloadPhoto(photos, product.images)) {
				await rmPhotos(mod.photo)
				product.variants[ind].photo = []
				product.variants[ind].photo = []
				for (const i in photos) {
					const photoUrl = photos[i].downloadHref
					const id = product.variants[ind]._id?.toString() || ""
					const { filename, updated } = await downloadPhoto({ Authorization, photo: photoUrl, id })
					if (filename && updated) {
						const { filename, miniature, updated } = photos[i]
						product.variants[ind].photo.push(`/static/img/${product.variants[ind]._id?.toString()}/${filename}`)
						product.variants[ind].images.push({ filename, miniature, updated })
						await product.save()
					}
				}
			}
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}

export const oneVariantDelete = async (href: string) => {
	try {
		console.log('Удаление модификации', href);
		const variants = await ms.GET(href)
		const normalize = variants.rows.map((item: any) => ({
			identifier: item.id,
			name: item.name,
			photo: item.images?.meta?.href,
			price: item.salePrices[0].value,
			productId: item.product.meta.href.split("/").pop(),
			value: item.characteristics[0].value,
			variantsLabel: item.characteristics[0].name,
		}))[0]

		const mod = normalize
		const product = await ProductModel.findOne({
			identifier: mod.productId,
		})
		if (!product) {
			console.log(`Товар ${mod.productId} не найден`)
			return
		}

		const rmIds = []
		for (const i in product.variants) {
			const variant = product.variants[i]
			const removeFlag = !normalize.some(
				({ identifier }: any) => variant.identifier === identifier
			)
			if (removeFlag) {
				rmIds.push(variant._id?.toString())
			}
		}
		for (const i in rmIds) {
			const id = rmIds[i]
			const index = product.variants.findIndex(
				({ _id }) => id === _id?.toString()
			)
			if (index !== -1) {
				await rmPhotos(product.variants[index].photo)
				product.variants.splice(index, 1)
				await product.save()
			}
		}
		if (product.variants.length === 0) {
			await ProductModel.findByIdAndUpdate(product._id, {
				$unset: { variantsLabel: true },
			})
		}
	} catch (e) {
		console.log(e)
		throw e
	}
}