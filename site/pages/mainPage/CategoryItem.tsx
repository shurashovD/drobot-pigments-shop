import { ICategory } from '../../../shared/index'
import { FC } from 'react'
import ImageComponent from '../../components/ImageComponent'
import { useNavigate } from 'react-router-dom'

interface IProps {
	category?: ICategory
	widthToHeight: number
	title: string
	description?: string
}

const CategoryItem: FC<IProps> = ({ category, widthToHeight, title, description }) => {
	const navigate = useNavigate()

	const clickHandler = () => {
		const id = category?._id.toString()
		if ( !id ) {
			return
		}
		const hasSubCategories = !!category?.subCategories.length
		const path = hasSubCategories ? "parent-category" : "category"
		const to = `/${path}/${id}/[]`
		navigate(to)
	}

	return (
		<div className="position-relative h-100 category-card" onClick={() => clickHandler()}>
			<ImageComponent src={category?.photo[0] || "/static/"} widthToHeight={widthToHeight} />
			<div className="w-100 p-2 px-xl-4 bottom-0 start-0 end-0 d-flex align-items-center category-card__label">
				<div>
					<span className="text-uppercase nowrap">{title}</span>
					<span> {description}</span>
				</div>
			</div>
		</div>
	)
}

export default CategoryItem