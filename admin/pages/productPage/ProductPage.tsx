import { useEffect } from "react"
import { Button, Col, Container, Row, Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useGetProductByIdQuery } from "../../application/product.service"
import { resetCheckedVariant, setCheckedVariant } from "../../application/productPageSlice"
import ProductCard from "./ProductCard"
import ProductsFilters from "./ProductFilters"
import ProductVariants from "./ProductVariants"

const ProductPage = () => {
    const {id} = useParams()
    const { data, isLoading, isFetching } = useGetProductByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const { checkedVariant } = useAppSelector(state => state.productPageSlice)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		if ( !checkedVariant && data && data.variants.length ) {
			dispatch(setCheckedVariant(data.variants[0].id))
		}
	}, [data, dispatch, setCheckedVariant])

	useEffect(() => {
		return () => {
			dispatch(resetCheckedVariant())
		}
	}, [dispatch, resetCheckedVariant])

    return (
		<Container>
			<Button variant="link" className="mb-3" onClick={() => navigate(-1)}>
				&larr; назад
			</Button>
			{isLoading && (
				<div className="d-flex p-5">
					<Spinner animation="border" variant="secondary" size="sm" className="m-auto" />
				</div>
			)}
			{data && (
				<Row>
					<Col xs={12} lg={4}>
						<ProductCard
							disabled={isFetching}
							id={id || ""}
							name={data.variants.find(({ id }) => id === checkedVariant)?.name || data.name}
							description={data.description}
							photo={data.variants.find(({ id }) => id === checkedVariant)?.photo || data.photo}
						/>
					</Col>
					<Col xs={12} lg={4}>
						<ProductsFilters categoryId={data.category || ""} disabled={isFetching} productId={id || ""} properties={data.properties} />
					</Col>
					<Col xs={12} lg={4}>
						<ProductVariants variantsLabel={data.variantsLabel} variants={data.variants} />
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default ProductPage