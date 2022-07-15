import { useEffect } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery } from "../../application/category.service"
import { initFilterObject } from "../../application/filtersSlice"
import { useAppDispatch } from "../../application/hooks"
import Products from "./Products"

const CategoryPage = () => {
    const {id, filters} = useParams()
    const { data, isLoading } = useGetCategoryByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( filters ) {
			let arr
			try {
				arr = JSON.parse(filters)
				dispatch(initFilterObject(arr))
			}
			catch {}
		}
	}, [filters])

    return (
		<Container className="pb-6">
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
            {!isLoading && data && (
                <h3>{data.title}</h3>
            )}
			{!isLoading && data && (
				<Row>
					<Col xs={0} lg={3}></Col>
					<Col xs={12} lg={9}>
                        <Products
                            categoryId={id || ''}
                        />
                    </Col>
				</Row>
			)}
		</Container>
	)
}

export default CategoryPage