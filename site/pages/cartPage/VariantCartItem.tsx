import { FC, useEffect, useRef, useState } from "react"
import { Button, Col, Fade, Form, ListGroup, Row, Spinner } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { ICart } from "../../../shared"
import { useDeleteFromCartMutation, useGetCartQuery, useToggleCheckOneMutation } from "../../application/order.service"
import { useGetVariantQuery } from "../../application/product.service"
import VariantCounter from "../../components/card/VariantCounter"
import CheckboxComponent from "../../components/CheckboxComponent"
import IconDelete from "../../components/icons/IconDelete"
import IconFavourite from "../../components/icons/IconFavourite"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
	productId: string
	variantId: string
}

const VariantCartItem: FC<IProps> = ({ productId, variantId }) => {
	const { data: cart, isFetching: cartFetching } = useGetCartQuery(undefined)
    const { data, isLoading: variantLoading, isFetching } = useGetVariantQuery({ productId, variantId }, { refetchOnMountOrArgChange: true })
	const [remove, { isLoading }] = useDeleteFromCartMutation()
	const [toggle, { isLoading: toggleLoading }] = useToggleCheckOneMutation()
	const [variantInCart, setVariantInCart] = useState<ICart["products"][0] | undefined>()
	const [price, setPrice] = useState<string | undefined>()
	const [lastPrice, setLastPrice] = useState<string | undefined>()
	const [discount, setDiscount] = useState<string | undefined>()
    const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
		})
	)

	const rmHandler = () => {		
		remove({ productIds: [], variantIds: [variantId] })
	}

	useEffect(() => {
		if (cart) {
			const variant = cart.variants.find((item) => item.variantId === variantId)
			if (variant) {
				setVariantInCart(variant)
				const price = (variant.price - (variant.discountOn || 0)) * variant.quantity
				setPrice(formatter.current.format(price))
				if (variant.discountOn && variant.discountOn > 0) {
					setDiscount(formatter.current.format(variant.discountOn * variant.quantity))
					setLastPrice(formatter.current.format(variant.price * variant.quantity))
				} else {
					setDiscount(undefined)
					setLastPrice(undefined)
				}
			}
		}
	}, [cart, formatter])

    return (
		<ListGroup.Item className="py-4 bg-transparent px-0">
			{variantLoading && (
				<div className="text-center p-4">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!variantLoading && data && variantInCart && (
				<Row className="g-2">
					<Col xs={0} md={0} className="d-none align-items-center">
						<div className="d-none d-md-block">
							<CheckboxComponent
								isLoading={toggleLoading}
								checked={variantInCart.checked || false}
								className="d-none d-md-block"
								disabled={isFetching || isLoading || cartFetching || toggleLoading}
								onChange={() => toggle({ productId, variantId })}
							/>
						</div>
					</Col>
					<Col xs={5} md={3}>
						<div className="position-relative">
							<ImageComponent src={data.photo?.[0] || "/static"} />
							<div className="position-absolute top-0 start-0 bg-white d-none p-0 m-2">
								<CheckboxComponent
									isLoading={toggleLoading}
									checked={variantInCart.checked || false}
									disabled={isFetching || isLoading || cartFetching || toggleLoading}
									onChange={() => toggle({ productId, variantId })}
								/>
							</div>
						</div>
					</Col>
					<Col xs={4} md={5} className="d-flex flex-column justify-content-between ps-md-2">
						<NavLink className="cart-item-name" to={`/product/${productId}?variantId=${variantId}`}>
							{data.name}
						</NavLink>
						<div className="d-none d-md-block">
							<VariantCounter productId={productId} variantId={variantId} />
						</div>
					</Col>
					<Fade in={!cartFetching && !toggleLoading}>
						<Col xs={3} md={4} className="d-flex flex-column justify-content-between align-items-end">
							<div className="fs-3 mb-1">{price}</div>
							{lastPrice && <div className="text-muted text-decoration-line-through">{lastPrice}</div>}
							{discount && (
								<div className="text-danger">
									<span className="d-inline d-lg-none">-</span>
									<span className="d-none d-lg-inline">Скидка </span>
									<span>{discount}</span>
								</div>
							)}
							<div className="w-100 d-none d-md-flex justify-content-between mt-auto">
								<Button variant="link" className="text-start w-100 m-0 p-0 text-muted" disabled={isLoading}>
									В избранное
								</Button>
								<Button disabled={isLoading} variant="link" className="text-end w-100 m-0 p-0 text-muted" onClick={rmHandler}>
									Удалить
								</Button>
							</div>
						</Col>
					</Fade>
				</Row>
			)}
			{!variantLoading && data && (
				<Row className="d-md-none mt-4 g-1 g-md-2">
					<Col xs={5}>
						<VariantCounter productId={productId} variantId={variantId} />
					</Col>
					<Col xs={4} className="offset-3">
						<div className="w-100 d-flex d-md-none justify-content-between">
							<Button variant="link" className="text-start w-100 m-0 p-0" disabled={isLoading}>
								<IconFavourite stroke="#9E9E9E" />
							</Button>
							<Button disabled={isLoading} variant="link" className="text-end w-100 m-0 p-0" onClick={rmHandler}>
								<IconDelete stroke="#9E9E9E" />
							</Button>
						</div>
					</Col>
				</Row>
			)}
		</ListGroup.Item>
	)
}

export default VariantCartItem