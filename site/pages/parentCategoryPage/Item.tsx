import { FC } from "react"
import { NavLink } from "react-router-dom"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
    id: string
    title: string
    photo?: string
}

const Item: FC<IProps> = ({ id, title, photo }) => {
    const to = `/category/${id}/[]`

    return (
		<div className="position-relative overflow-hidden">
			<ImageComponent src={photo || "/static/"} />
			<NavLink className="w-100 p-2 px-xl-4 bottom-0 start-0 end-0 d-flex align-items-center category-card__label" to={to}>
				<div>
					<span className="text-uppercase nowrap">{title}</span>
				</div>
			</NavLink>
		</div>
	)
}

export default Item