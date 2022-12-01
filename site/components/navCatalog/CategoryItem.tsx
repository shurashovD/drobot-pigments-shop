import { FC, useRef } from "react"
import { Nav } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { resetFilters } from "../../application/filtersSlice"
import { useAppDispatch } from "../../application/hooks"
import { hideNavCatalog, setPane } from "../../application/navCatalogSlice"

interface IProps {
	id: string
	hasSubCategories: boolean
	title: string
}

const CategoryItem: FC<IProps> = ({ id, hasSubCategories, title }) => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const timerId = useRef<ReturnType<typeof setTimeout>>()

	const clickHandler = () => {
		const path = hasSubCategories ? "parent-category" : "category"
		const to = `/${path}/${id}/[]`
		dispatch(resetFilters())
		navigate(to)
		dispatch(hideNavCatalog())
		dispatch(setPane())
	}

	const hoverHandler = () => {
		timerId.current = setTimeout(() => {
			dispatch(setPane(id))
		}, 250)
	}

	const leaveHandler = () => {
		if (timerId.current) {
			clearTimeout(timerId.current)
		}
	}

	return (
		<Nav.Item onMouseOver={() => hoverHandler()} onMouseLeave={leaveHandler}>
			<Nav.Link eventKey={id} onClick={() => clickHandler()} className="ps-6 py-4 text-uppercase">
				{title}
			</Nav.Link>
		</Nav.Item>
	)
}

export default CategoryItem