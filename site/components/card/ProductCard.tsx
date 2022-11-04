import { FC } from "react"
import { Col, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import ImageComponent from "../ImageComponent"
import ButtonCart from "./ButtonCart"
import Raiting from "./Raiting"
import ToCompare from "./ToCompare"
import ToFavourite from "./ToFavourite"

interface IProps {
	id: string
	img?: string
	price?: string
	raiting?: number
	reviewsCount?: number
	title?: string
	variantId?: string
	variantTitle?: string
}


const ProductCard: FC<IProps> = (props) => {
    return (
		<div className="d-flex flex-column justify-content-start align-items-stretch h-100 position-relative">
			<div className="position-absolute top-0 end-0 p-2">
				<ToFavourite productId={props.id} variantId={props.variantId} />
			</div>
			<NavLink to={props.variantId ? `/product/${props.id}?variantId=${props.variantId}` : `/product/${props.id}`} className="my-1">
				<ImageComponent src={props.img || "/static"} />
				<div className="mt-1">{props.variantTitle || props.title}</div>
			</NavLink>
			<div className="mt-auto">
				<Raiting raiting={props.raiting} reviewsCount={props.reviewsCount} />
			</div>
			<span className="fs-3 my-4">{props.price}</span>
			<Row className="d-flex justify-content-between g-0">
				<Col xs="auto">
					<ButtonCart productId={props.id || ""} variantId={props.variantId} />
				</Col>
				<Col xs="auto" className="mx-auto">
					<ToCompare productId={props.id || ""} variantId={props.variantId} />
				</Col>
			</Row>
		</div>
	)
}

export default ProductCard