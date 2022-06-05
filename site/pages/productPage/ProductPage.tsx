import { useRef } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetProductByIdQuery } from "../../application/product.service"
import ButtonCart from "../../components/card/ButtonCart"
import Raiting from "../../components/card/Raiting"
import ImageComponent from "../../components/ImageComponent"

const ProductPage = () => {
    const {id} = useParams()
    const { data, isLoading } = useGetProductByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 2,
		})
	)

    return (
		<Container className="py-6">
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && data && (
				<p className="d-md-none fs-3 text-uppercase mb-4">
					{data.name}
				</p>
			)}
			{!isLoading && data && (
				<Row className="mb-3">
					<Col xs={12} md={5} className="d-flex justify-content-end">
						<Raiting />
					</Col>
				</Row>
			)}
			{!isLoading && data && (
				<Row className="mb-6">
					<Col xs={12} md={5}>
						<ImageComponent src={data.photo?.[0] || "/static"} />
					</Col>
					<Col
						xs={12}
						md={7}
						className="d-flex d-md-block justify-content-between align-items-center p-2 px-md-4"
					>
						<div className="fs-3 text-uppercase d-none d-md-block">{data.name}</div>
						{typeof data.price !== "undefined" && (
							<div className="fs-3 mt-md-5">
								{formatter.current.format(data.price)}
							</div>
						)}
						<div className="my-md-4 d-flex align-items-center">
							<div className="w-100 w-md-75">
								<ButtonCart productId={data.id} />
							</div>
						</div>
					</Col>
				</Row>
			)}
			{!isLoading && data && data.description && (
				<div className="w-100 w-lg-50">
					<h3 className="mb-5">О товаре</h3>
					<p>{data.description}</p>
				</div>
			)}
		</Container>
	)
}

export default ProductPage