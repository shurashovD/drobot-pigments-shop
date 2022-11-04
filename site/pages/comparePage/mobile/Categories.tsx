import { useEffect } from 'react'
import { Container, ListGroup, Tab } from 'react-bootstrap'
import { useGetCategoriesQuery } from '../../../application/compare.service'
import { setCategory } from '../../../application/compareSlice'
import { useAppDispatch, useAppSelector } from '../../../application/hooks'
import CategoryItem from './CategoryItem'

const Categories = () => {
	const { data } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true })
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (data && data.length === 0) {
			dispatch(setCategory(undefined))
		}
	}, [data, dispatch])

    return (
		<Tab.Pane eventKey="categories">
			<Container>
				<h3>Сравнение товаров</h3>
				{data?.length === 0 && <div className="text-muted">Здесь пока ничего нет</div>}
			</Container>
			<ListGroup>
				{data?.map(({ id, length, title }) => (
					<CategoryItem key={id} id={id} length={length} title={title} />
				))}
			</ListGroup>
		</Tab.Pane>
	)
}

export default Categories