import { FC } from 'react'
import ImageComponent from '../../components/ImageComponent'
import { NavLink, useNavigate } from 'react-router-dom'

interface IProps {
	categoryId: string
    src: string
	title: string
	widthToHeight: number
	filters: string
}

const Item: FC<IProps> = ({ categoryId, filters, src, title, widthToHeight }) => {
	const navigate = useNavigate()

    return (
		<div className="position-relative h-100 category-card" onClick={() => navigate(`/category/${categoryId}/${filters}`)}>
			<ImageComponent src={src} widthToHeight={widthToHeight} />
			<NavLink
				className="w-100 p-2 px-xl-4 bottom-0 start-0 end-0 d-flex align-items-center category-card__label"
				to={`/category/${categoryId}/${filters}`}
			>
				<div>
					<span className="text-uppercase nowrap">{title}</span>
				</div>
			</NavLink>
		</div>
	)
}

export default Item