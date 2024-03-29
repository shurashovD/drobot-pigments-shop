import { FC, useEffect, useState } from "react"
import { Col, Collapse, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { Product } from "../../../../shared"
import { useAppSelector } from "../../../application/hooks"
import ButtonCart from "../../../components/card/ButtonCart"
import ToFavourite from "../../../components/card/ToFavourite"
import ImageComponent from "../../../components/ImageComponent"

interface IProps {
	product: Product
}

const Item: FC<IProps> = ({ product }) => {
	const { scrolled } = useAppSelector(state => state.compareSlice)
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
			{!scrolled && (
				<div className="position-absolute top-0 end-0 p-2">
					<ToFavourite productId={product.id} variantId={product.variantId} />
				</div>
			)}
			<NavLink to={to} className="my-1">
				<Collapse in={!scrolled}>
					<div>
						<ImageComponent src={product.photo[0]} />
					</div>
				</Collapse>
				<div className="mt-1">{product.name}</div>
			</NavLink>
			<span className="mt-auto mb-2 fs-6">{price}</span>
			<Row className="d-flex justify-content-between">
				<Col xs={10}>
					<ButtonCart productId={product.id} variantId={product.variantId} />
				</Col>
			</Row>
		</div>
	)
}

export default Item