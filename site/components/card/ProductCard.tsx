import { FC } from "react"
import { Col, Row } from "react-bootstrap"
import ImageComponent from "../ImageComponent"
import ButtonCart from "./ButtonCart"
import Raiting from "./Raiting"

interface IProps {
	id?: string
	img?: string
	price?: string
	title?: string
}


const ProductCard: FC<IProps> = (props) => {
    return (
		<div className="d-flex flex-column justify-content-start align-items-stretch">
			<ImageComponent src={props.img || "/static"} />
			<span className="my-1">{props.title}</span>
			<Raiting />
			<span className="fs-3 my-4">{props.price}</span>
			<Row className="d-flex justify-content-between">
				<Col xs={10}>
					<ButtonCart productId={props.id || ""} />
				</Col>
			</Row>
		</div>
	)
}

export default ProductCard