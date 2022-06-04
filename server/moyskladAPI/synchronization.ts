import { IProduct } from './../../shared/index.d';
import fetch from 'node-fetch'
import config from 'config'
import Moysklad from "moysklad"
import CurrencyModel from '../models/CurrencyModel'
import UomModel from '../models/UomModel'
import CatalogModel from '../models/CatalogModel'
import ProductModel from '../models/ProductModel';

const moyskladCredentails: any = config.get("moysklad")
const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
    assortiment: 'entity/assortment',
    currency: 'entity/currency',
    product: 'entity/product',
    productFolder: 'entity/productfolder',
    uom: 'entity/uom'
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
	}
}

export const productSync = async () => {
    try {
        const goods = await ms.GET(paths.product)
        const normalize = goods.rows.map(({ id, archived, images, name, productFolder, salePrices, uom, weight }: any) => ({ 
            id, archived, name, price: salePrices[0].value, weight,
            parentId: productFolder?.meta.href.split('/').pop(),
            currency: salePrices[0].currency.meta.href.split('/').pop(),
			photo: [images?.meta?.href],
            uom: uom?.meta.href.split('/').pop()
         }))

        const products = await ProductModel.find()
        const categories = await CatalogModel.find()
        const currencies = await CurrencyModel.find()
        const uoms = await UomModel.find()

        // удаление продуктов, не содержащихся в "Мой склад";
        const deletedIdentifier = products.map(({identifier}: IProduct) => identifier).filter((item: string) => normalize.every(({id}: any) => id !== item))
        await ProductModel.deleteMany({ identifier: { $in: deletedIdentifier } })

        // добавление продуктов, не содержащихся в БД;
        const addedRows = normalize.filter(({id}: any) => products.every(({identifier}: IProduct) => identifier !== id))
        for (let i in addedRows) {
            const item = addedRows[i]
            const { archived, id, name, parentId, photo, price, weight } = item
            const currency = currencies.find(({identifier}) => identifier === item.currency)
            const parent = categories.find(({identifier}) => identifier === parentId)?._id
            const uom = uoms.find(({identifier}) => identifier === item.uom)
            if ( parent ) {
                await new ProductModel({
                    archived, currency, identifier: id, name, parent, price, uom, weight
                }).save()
            }
            else {
                await new ProductModel({
                    archived, currency, identifier: id, name, price, uom, weight
                }).save()
            }
        }

        // обновление измененных продуктов;
        for (let i in normalize) {
            const item = normalize[i]
            const { archived, id, name, parentId, photo, price, weight } = item
            const currency = currencies.find(({identifier}) => identifier === item.currency)
            const parent = categories.find(({identifier}) => identifier === parentId)?._id
            const uom = uoms.find(({identifier}) => identifier === item.uom)
            if ( parent ) {
                await ProductModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { archived, currency, name, parent, price, uom, weight }
                )
            }
            else {
                await ProductModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { archived, currency, name, price, uom, weight }
                )
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}