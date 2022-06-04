import { Button, Col, Container, Row, Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useGetProductByIdQuery } from "../../../application/product.service"
import ProductBinds from "./ProductBinds"
import ProductCard from "./ProductCard"
import ProductsFilters from "./ProductFilters"

const CategoryProductPage = () => {
    const {id} = useParams()
    const { data, isLoading, isFetching } = useGetProductByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const navigate = useNavigate()

    return (
		<Container>
			<Button variant="link" className="mb-3" onClick={() => navigate(-1)}>&larr; назад</Button>
			{isLoading && (
				<div className="d-flex p-5">
					<Spinner
						animation="border"
						variant="secondary"
						size="sm"
						className="m-auto"
					/>
				</div>
			)}
			{data && (
				<Row>
					<Col xs={12} lg={4}>
						<ProductCard
							disabled={isFetching}
							id={id || ""}
							name={data.name}
							description={data.description}
							photo={data.photo[0]}
						/>
					</Col>
					<Col xs={12} lg={4}>
						<ProductsFilters
							categoryId={data.category || ''}
							disabled={isFetching}
							productId={id || ''}
							properties={data.properties}
						/>
					</Col>
					<Col xs={12} lg={4}>
						<ProductBinds
							binds={data.binds}
							disabled={isFetching}
							productId={id || ''}
						/>
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default CategoryProductPage