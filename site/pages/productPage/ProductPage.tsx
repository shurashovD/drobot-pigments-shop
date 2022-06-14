import { useEffect, useRef, useState } from "react"
import { Button, Col, Container, Fade, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetProductByIdQuery } from "../../application/product.service"
import ButtonCart from "../../components/card/ButtonCart"
import Raiting from "../../components/card/Raiting"
import ImageComponent from "../../components/ImageComponent"

const ProductPage = () => {
    const {id} = useParams()
    const { data, isLoading, isSuccess } = useGetProductByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const [toCart, setToCart] = useState<string | undefined>()
	const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 2,
		})
	)

	useEffect(() => {
		if ( data && isSuccess ) {
			if ( data.variants.length === 0 ) {
				setToCart(data.id)
			}
		}
	}, [data, isSuccess])

    return (
		<Container className="py-6">
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && data && (
				<p className="d-md-none fs-3 text-uppercase mb-4">
					{data.variants.find(({ id }) => id === toCart)?.name ||
						data.name}
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
						<ImageComponent
							src={
								data.variants.find(({ id }) => id === toCart)
									?.photo ||
								data.photo?.[0] ||
								"/static"
							}
						/>
					</Col>
					<Col
						xs={12}
						md={7}
						className="d-flex d-md-block justify-content-between align-items-center p-2 px-md-4"
					>
						<div className="fs-3 text-uppercase d-none d-md-block">
							{data.variants.find(({ id }) => id === toCart)
								?.name || data.name}
						</div>
						{data.variants.length > 0 && data.variantsLabel && (
							<div>
								<div className="text-muted mb-2 mt-3">
									{data.variantsLabel}:
								</div>
								{data.variants.map(({ id, value }) => (
									<Button
										variant="link"
										className={`border border-gray me-1 p-2 ${
											id === toCart && "bg-light"
										}`}
										key={id}
										onClick={() => setToCart(id)}
									>
										{value}
									</Button>
								))}
							</div>
						)}
						{typeof data.price !== "undefined" && (
							<div className="fs-3 mt-md-5">
								{formatter.current.format(
									(data.variants.find(
										({ id }) => id === toCart
									)?.price || data.price) / 100
								)}
							</div>
						)}
						<div className="my-md-4 d-flex align-items-center">
							<Fade in={!!toCart}>
								<div className="w-100 w-md-75">
									<ButtonCart productId={toCart || ""} />
								</div>
							</Fade>
						</div>
					</Col>
				</Row>
			)}
			{!isLoading && data && data.description && (
				<div className="w-100 w-lg-50">
					<h3 className="mb-5">О товаре</h3>
					<pre style={{ whiteSpace: "pre-wrap" }}>
						{data.description}
					</pre>
				</div>
			)}
		</Container>
	)
}

export default ProductPage