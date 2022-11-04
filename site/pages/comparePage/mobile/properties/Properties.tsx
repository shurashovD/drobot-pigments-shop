import { useEffect, useState } from "react"
import { Button, Container, Tab } from "react-bootstrap"
import { useGetCategoriesQuery } from "../../../../application/compare.service"
import { setCategory } from "../../../../application/compareSlice"
import { useAppDispatch, useAppSelector } from "../../../../application/hooks"
import CompareList from "./CompareList"
import Goods from "./Goods"
import Settings from "./Settings"

const Properties = () => {
	const { data: categories } = useGetCategoriesQuery()
	const { categoryId } = useAppSelector(state => state.compareSlice)
	const [title, setTitle] = useState<string|undefined>()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (categoryId && categories) {
			const title = categories.find(({ id }) => (id === categoryId))?.title
			setTitle(title)
		}
	}, [categoryId, categories])

    return (
		<Tab.Pane eventKey="properties">
			<Container>
				<Button variant="link" className="text-muted px-0 pb-0 pt-5" onClick={() => dispatch(setCategory(undefined))}>
					&larr; назад
				</Button>
				<h3>{title}</h3>
				<Settings />
			</Container>
			<div className="pb-5" />
			<Goods />
			<div className="pb-5" />
			<CompareList />
		</Tab.Pane>
	)
}

export default Properties