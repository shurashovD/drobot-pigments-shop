import { useEffect } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery } from "../../application/category.service"
import Products from "./Products"

const CategoryPage = () => {
    const {id} = useParams()
    const { data, isLoading } = useGetCategoryByIdQuery(id || '', { refetchOnMountOrArgChange: true })

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