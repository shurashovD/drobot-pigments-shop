import { model, Model, Schema, Types } from "mongoose";
import { ICategoryContent, ICategoryContentMethods } from "../../shared";

interface ICategoryContentModel extends Model<ICategoryContent, {}, ICategoryContentMethods> {
	createContent(categoryId: string | Types.ObjectId): Promise<ICategoryContent>
	clearContent(categoryId: string | Types.ObjectId): Promise<void>
}

const CategoryContentSchema = new Schema<ICategoryContent, ICategoryContentModel, ICategoryContentMethods>({
	carouselImages: [
		new Schema<ICategoryContent["carouselImages"][0]>({
			href: String,
			to: String,
			imgSrc: String,
		}),
	],
	categoryId: { type: Schema.Types.ObjectId, ref: 'Category', unique: true },
	sideBarLinks: [
		new Schema<ICategoryContent["sideBarLinks"][0]>({
			href: String,
			text: String,
			to: String,
		}),
	],
	videos: [String],
})

CategoryContentSchema.statics.createContent = async function (categoryId: string | Types.ObjectId): Promise<ICategoryContent> {
	try {
		return await new this({ categoryId }).save()
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.statics.clearContent = async function (categoryId: string | Types.ObjectId): Promise<void> {
	try {
		await this.findOneAndDelete({ categoryId })
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.addImage = async function(this: ICategoryContent, path: string): Promise<void> {
    try {
        const imageAlreadyExists = this.carouselImages.some(({ imgSrc }) => (imgSrc === path))
        if ( imageAlreadyExists ) {
            return
        }

        this.carouselImages.push({ imgSrc: path })
        await this.save()
    } catch (e) {
        throw e
    }
}

CategoryContentSchema.methods.addSideBarLink = async function(this: ICategoryContent, text: string, href: string | undefined, to: string | undefined): Promise<void> {
    try {
        const textAlreadyExists = this.sideBarLinks.some(item => item.text && item.text === text)
        if ( textAlreadyExists ) {
            const err = new Error('Такой текст ссылки уже присутствует в категории')
            err.userError = true
            throw err
        }

        this.sideBarLinks.push({ href, text, to })
        await this.save()
    } catch (e) {
        throw e
    }
}

CategoryContentSchema.methods.addVideo = async function (this: ICategoryContent, path: string): Promise<void> {
	try {
		const videoAlreadyExists = this.videos.some((item) => item === path)
		if (videoAlreadyExists) {
			return
		}

		this.videos.push(path)
		await this.save()
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.rmImage = async function (this: ICategoryContent, id: string): Promise<void> {
	try {
		const index = this.carouselImages.findIndex(({ _id }) => (_id?.toString() === id))
        if ( index !== -1 ) {
            this.carouselImages.splice(index, 1)
            await this.save()
        }
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.rmSideBarLink = async function (this: ICategoryContent, id: string): Promise<void> {
	try {
		const index = this.sideBarLinks.findIndex(({ _id }) => _id?.toString() === id)
		if (index !== -1) {
			this.sideBarLinks.splice(index, 1)
			await this.save()
		}
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.rmVideo = async function (this: ICategoryContent, path: string): Promise<void> {
	try {
		const index = this.videos.findIndex(item => item === path)
		if (index !== -1) {
			this.videos.splice(index, 1)
			await this.save()
		}
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.updImage = async function (
	this: ICategoryContent,
	id: Types.ObjectId | string,
	href: string | undefined,
	to: string | undefined
): Promise<void> {
	try {
		const index = this.carouselImages.findIndex(({ _id }) => _id?.toString() === id.toString())
		if (index !== -1) {
            if ( href ) {
                this.carouselImages[index].href = href
                this.carouselImages[index].to = undefined
            }
            if ( to ) {
                this.carouselImages[index].href = undefined
                this.carouselImages[index].to = to
            }
			await this.save()
		}
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.updSideBarLink = async function (
	this: ICategoryContent,
	id: Types.ObjectId | string,
	text: string | undefined,
	href: string | undefined,
	to: string | undefined
): Promise<void> {
	try {
        const textAlreadyExists = this.sideBarLinks.some((item) => item.text && item.text === text && item._id?.toString() !== id.toString())
		if (textAlreadyExists) {
			const err = new Error("Такой текст ссылки уже присутствует в категории")
			err.userError = true
			throw err
		}

		const index = this.sideBarLinks.findIndex(({ _id }) => _id?.toString() === id.toString())
		if (index !== -1) {
            if ( text ) {
                this.sideBarLinks[index].text = text
            }
			if (href) {
				this.sideBarLinks[index].href = href
				this.sideBarLinks[index].to = undefined
			}
			if (to) {
				this.sideBarLinks[index].href = undefined
				this.sideBarLinks[index].to = to
			}
			await this.save()
		}
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.sortImages = async function (this: ICategoryContent, order: string[]): Promise<void> {
	try {
        const sortCb = function (a: any, b: any) {
			const getIndex = function (this: any): number {
				const id = this?._id?.toString()
				return order.findIndex((item) => item === id)
			}
			return getIndex.call(a) - getIndex.call(b)
		}

        this.carouselImages.sort(sortCb)
        await this.save()
	} catch (e) {
		throw e
	}
}

CategoryContentSchema.methods.sortSideBarLinks = async function (this: ICategoryContent, order: string[]): Promise<void> {
	try {
		const sortCb = function (a: any, b: any) {
			const getIndex = function (this: any): number {
				const id = this?._id?.toString()
				return order.findIndex((item) => item === id)
			}
			return getIndex.call(a) - getIndex.call(b)
		}

		this.sideBarLinks.sort(sortCb)
		await this.save()
	} catch (e) {
		throw e
	}
}

const CategoryContentModel = model<ICategoryContent, ICategoryContentModel>("CategoryContent", CategoryContentSchema)
export default CategoryContentModel