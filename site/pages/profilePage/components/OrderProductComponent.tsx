import { FC } from "react"
import { Col, Row } from "react-bootstrap"
import ImageComponent from "../../../components/ImageComponent"

interface IProps {
    imageSrc?: string
    variant?: string
    name: string
    price: number
    quantity: number
}

const OrderProductComponent: FC<IProps> = (props) => {
    const formatter = new Intl.NumberFormat('ru', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    })

    return (
		<Row className="order-product-component pb-5 pb-lg-6">
			<Col xs={4}>
				<ImageComponent src={props.imageSrc || "/static"} />
			</Col>
			<Col xs={8} className="d-flex flex-column">
				<div className="text-uppercase mb-1">{props.name}</div>
				<small className="text-muted mb-1">{props.variant}</small>
				<div className="my-auto">
					{formatter.format(props.price / 100)} {props.quantity}шт.
				</div>
			</Col>
		</Row>
	)
}

export default OrderProductComponent