import { useEffect, useRef, useState } from "react"
import { Button, Col, Container, Fade, Row, Spinner } from "react-bootstrap"
import { useParams, useLocation } from "react-router-dom"
import { useGetProductByIdQuery } from "../../application/product.service"
import Raiting from "../../components/card/Raiting"
import ImageComponent from "../../components/ImageComponent"
import ToCartBtn from "./ToCartBtn"

const ProductPage = () => {
    const {id} = useParams()
	const { search } = useLocation()
    const { data, isLoading } = useGetProductByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const [toCart, setToCart] = useState<string | undefined>()
	const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 2,
		})
	)

	useEffect(() => {
		if ( search ) {
			const variantId = search.split("=")?.[1]
			if ( variantId ) {
				setToCart(variantId)
			}
		}
	}, [search])

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
						className="d-flex flex-wrap d-md-block justify-content-between align-items-center p-2 px-md-4"
					>
						<div className="fs-3 text-uppercase d-none d-md-block">
							{data.variants.find(({ id }) => id === toCart)
								?.name || data.name}
						</div>
						{data.variants.length > 0 && data.variantsLabel && (
							<div className="w-100 order-2">
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
							<div className="fs-3 mt-md-5 order-0">
								{formatter.current.format(
									(data.variants.find(
										({ id }) => id === toCart
									)?.price || data.price) / 100
								)}
							</div>
						)}
						<div className="my-md-4 d-flex align-items-center order-1">
							<Fade in={!!toCart} className="w-100">
								<div className="w-100 w-md-75">
									<ToCartBtn
										productId={id || ''}
										variantId={toCart}
										disabled={isLoading}
									/>
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