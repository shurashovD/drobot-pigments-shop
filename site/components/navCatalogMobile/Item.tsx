import { FC } from "react"
import { ListGroup } from "react-bootstrap"

interface IProps {
	hasSubCategories: boolean
	id: string
	title: string
	clickHandler: (to: string) => void
} 

const Item: FC<IProps> = ({ clickHandler, hasSubCategories, id, title }) => {
    const path = hasSubCategories ? "parent-category" : "category"
	const to = `/${path}/${id}/[]`

    return (
		<ListGroup.Item
			as="button"
			variant="link"
			className="text-start text-uppercase p-4 catalog-mobile-list-item"
			onClick={() => clickHandler(to)}
		>
			{title}
		</ListGroup.Item>
	)
}

export default Item