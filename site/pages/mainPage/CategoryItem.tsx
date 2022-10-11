import { ICategory } from '../../../shared/index'
import { FC } from 'react'
import ImageComponent from '../../components/ImageComponent'
import { NavLink, useNavigate } from 'react-router-dom'

interface IProps {
    category?: ICategory
	widthToHeight: number
	title: string
	description?: string 
}

const CategoryItem: FC<IProps> = ({ category, widthToHeight, title, description }) => {
	const navigate = useNavigate()

	const to = category?.frontEndKey === "pigments" ? `/pigments/${category?._id?.toString()}` : `/category/${category?._id?.toString()}/[]`

    return (
		<div className="position-relative h-100 category-card" onClick={() => navigate(to)}>
			<ImageComponent src={category?.photo[0] || "/static/"} widthToHeight={widthToHeight} />
			<NavLink
				className="w-100 p-2 px-xl-4 bottom-0 start-0 end-0 d-flex align-items-center category-card__label"
				to={to}
			>
				<div>
					<span className="text-uppercase nowrap">{title}</span>
					<span>{" "}{description}</span>
				</div>
			</NavLink>
		</div>
	)
}

export default CategoryItem