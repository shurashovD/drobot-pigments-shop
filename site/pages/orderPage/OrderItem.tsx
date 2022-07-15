import { FC, useEffect, useRef, useState } from "react"
import { Col, ListGroup, Row, Spinner } from "react-bootstrap"
import { useGetProductByIdQuery, useGetVariantQuery } from "../../application/product.service"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
    productId: string
    variantId?: string
    quantity: number
}

const OrderItem: FC<IProps> = ({ productId, quantity, variantId }) => {
    const [show, setShow] = useState(false)
    const {data: product, isLoading: productLoading} = useGetProductByIdQuery(productId, { skip: !!variantId })
    const { data: variant, isLoading: varaintLoading } = useGetVariantQuery(
		{ productId, variantId: variantId || '' },
		{ skip: !variantId }
	)
    const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
		})
	)

    useEffect(() => {
        setShow(true)
        return () => {
            setShow(false)
        }
    })

    return (
		<ListGroup.Item className="bg-transparent px-0">
			{(productLoading || varaintLoading) && (
				<div className="text-center p-5">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{(product || variant) && (
				<Row>
					<Col xs={4} md={2}>
						<div>
							{show && (
								<ImageComponent
									src={
										product?.photo[0] ||
										variant?.photo ||
										"/static"
									}
								/>
							)}
						</div>
						<div className="d-md-none mt-2 fs-3">
							{product && (
								<>
									{formatter.current.format(
										(product.price || 0) / 100
									)}
								</>
							)}
						</div>
						<div className="d-md-none fs-3">
							{variant && (
								<>
									{formatter.current.format(
										variant.price / 100
									)}
								</>
							)}
						</div>
					</Col>
					<Col xs={7} md={4} className="d-flex flex-column">
						<div>{product?.name || variant?.name}</div>
						<div className="my-auto">{variant?.value}</div>
					</Col>
					<Col
						xs={1}
						md={3}
						className="d-flex justify-content-center align-items-center"
					>
						{quantity} ШТ
					</Col>
					<Col xs={0} md={3} className="fs-3 d-none d-md-flex">
						<div>
							{product && (
								<>
									{formatter.current.format(
										(product.price || 0) / 100
									)}
								</>
							)}
						</div>
						<div>
							{variant && (
								<>
									{formatter.current.format(
										variant.price / 100
									)}
								</>
							)}
						</div>
					</Col>
				</Row>
			)}
		</ListGroup.Item>
	)
}

export default OrderItem