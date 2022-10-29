import { FC, useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { Product } from "../../../../shared"
import ButtonCart from "../../../components/card/ButtonCart"
import ToFavourite from "../../../components/card/ToFavourite"
import ImageComponent from "../../../components/ImageComponent"

interface IProps {
	product: Product
}

const Item: FC<IProps> = ({ product }) => {
	const [price, setPrice] = useState("")
	const [to, setTo] = useState("/")
	const formatter = new Intl.NumberFormat("ru", { currency: "RUB", style: "currency", maximumFractionDigits: 0 })

	useEffect(() => {
        setPrice(formatter.format((product.price || 0) / 100))
		if (product.variantId) {
			setTo(`/product/${product.id}?variantId=${product.variantId}`)
		} else {
			setTo(`/product/${product.id}`)
		}
	}, [product])

	return (
		<div className="d-flex flex-column justify-content-start align-items-stretch h-100 position-relative">
			<div className="position-absolute top-0 end-0 p-2">
				<ToFavourite productId={product.id} variantId={product.variantId} />
			</div>
			<NavLink to={to} className="my-1">
				<ImageComponent src={product.photo[0]} />
				<div className="mt-1">{product.name}</div>
			</NavLink>
			<span className="fs-3 my-4">{price}</span>
			<Row className="d-flex justify-content-between">
				<Col xs={10}>
					<ButtonCart productId={product.id} variantId={product.variantId} />
				</Col>
			</Row>
		</div>
	)
}

export default Item