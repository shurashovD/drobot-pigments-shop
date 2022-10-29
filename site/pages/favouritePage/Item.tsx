import { FC, useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { IProduct } from "../../../shared"
import ButtonCart from "../../components/card/ButtonCart"
import ToFavourite from "../../components/card/ToFavourite"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
	product: IProduct
	variantId?: string
}

const Item: FC<IProps> = ({ product, variantId }) => {
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [img, setImg] = useState("/static")
    const [to, setTo] = useState("/")
    const formatter = new Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 })

    useEffect(() => {
        if ( variantId ) {
            const variant = product.variants.find(({ _id }) => (_id?.toString() === variantId))
            if ( variant ) {
                setTitle(variant.name)
                setPrice(formatter.format(variant.price / 100))
                setImg(variant.photo || "/static")
                setTo(`/product/${product._id.toString()}?variantId=${variantId}`)
            }
        } else {
            setTitle(product.name)
            setPrice(formatter.format((product.price || 0) / 100))
			setImg(product.photo[0] || "/static")
            setTo(`/product/${product._id.toString()}`)
        }
    }, [product, variantId])
    
	return (
		<div className="d-flex flex-column justify-content-start align-items-stretch h-100 position-relative">
			<div className="position-absolute top-0 end-0 p-2">
				<ToFavourite productId={product._id.toString()} variantId={variantId} />
			</div>
			<NavLink to={to} className="my-1">
				<ImageComponent src={img} />
				<div className="mt-1">{title}</div>
			</NavLink>
			<span className="fs-3 my-4">{price}</span>
			<Row className="d-flex justify-content-between">
				<Col xs={10}>
					<ButtonCart productId={product._id} variantId={variantId} />
				</Col>
			</Row>
		</div>
	)
}

export default Item