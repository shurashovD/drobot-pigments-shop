import { FC, useEffect, useRef, useState } from "react"
import { Button, Col, Fade, Form, ListGroup, Row, Spinner } from "react-bootstrap"
import { ICart } from "../../../shared"
import { useDeleteFromCartMutation, useGetCartQuery, useToggleCheckOneMutation } from "../../application/order.service"
import { useGetProductByIdQuery } from "../../application/product.service"
import ProductCounter from "../../components/card/ProductCounter"
import CheckboxComponent from "../../components/CheckboxComponent"
import IconDelete from "../../components/icons/IconDelete"
import IconFavourite from "../../components/icons/IconFavourite"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
	productId: string
}

const CartItem: FC<IProps> = ({ productId }) => {
	const { data: cart, isFetching: cartFetching } = useGetCartQuery(undefined)
    const { data, isFetching, isLoading: productLoading } = useGetProductByIdQuery(productId, { refetchOnMountOrArgChange: true })
	const [remove, { isLoading }] = useDeleteFromCartMutation()
	const [toggle, { isLoading: toggleLoading }] = useToggleCheckOneMutation()
	const [productInCart, setProductInCart] = useState<ICart['products'][0] | undefined>()
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
		remove({ productIds: [productId], variantIds: [] })
	}

	useEffect(() => {
		if ( cart ) {
			const product = cart.products.find((item) => item.productId === productId)
			if ( product ) {
				setProductInCart(product)
				const price = (product.price - (product.discountOn || 0)) * product.quantity
				setPrice(formatter.current.format(price))
				if (product.discountOn && product.discountOn > 0) {
					setDiscount(formatter.current.format(product.discountOn * product.quantity))
					setLastPrice(formatter.current.format(product.price * product.quantity))
				} else {
					setDiscount(undefined)
					setLastPrice(undefined)
				}
			}
		}
	}, [cart, formatter])

    return (
		<ListGroup.Item className="py-4 bg-transparent">
			{productLoading && (
				<div className="text-center p-4">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!productLoading && data && productInCart && (
				<Row>
					<Col xs={0} md={1} className="d-flex align-items-center">
						<CheckboxComponent
							isLoading={toggleLoading}
							disabled={isFetching || isLoading || cartFetching || toggleLoading}
							checked={productInCart.checked || false}
							className="d-none d-md-block"
							onChange={() => toggle({ productId })}
						/>
					</Col>
					<Col xs={4} md={2} className="px-md-0">
						<div className="position-relative">
							<ImageComponent src={data.photo?.[0] || "/static"} />
							<Form.Check
								disabled={isFetching || isLoading || cartFetching || toggleLoading}
								checked={productInCart.checked || false}
								onChange={() => toggle({ productId })}
								className="d-md-none position-absolute top-0 start-0 m-2"
							/>
						</div>
					</Col>
					<Col xs={4} md={5} className="d-flex flex-column justify-content-between">
						<span>{data.name}</span>
						<div className="d-none d-md-block">
							<ProductCounter productId={productId} />
						</div>
					</Col>
					<Fade in={!cartFetching && !toggleLoading}>
						<Col xs={4} md={4} className="d-flex flex-column justify-content-between align-items-end">
							<div className="fs-3">{price}</div>
							{lastPrice && <div className="text-muted text-decoration-line-through">{lastPrice}</div>}
							{discount && (
								<div className="text-danger">
									<span className="d-inline d-lg-none">-</span>
									<span className="d-none d-lg-inline">Скидка </span>
									<span>{discount}</span>
								</div>
							)}
							<div className="w-100 d-none d-md-flex justify-content-between">
								<Button variant="link" className="text-start w-100 m-0 p-0" disabled={isLoading}>
									В избранное
								</Button>
								<Button disabled={isLoading} variant="link" className="text-end w-100 m-0 p-0" onClick={rmHandler}>
									Удалить
								</Button>
							</div>
						</Col>
					</Fade>
				</Row>
			)}
			{!productLoading && data && (
				<Row className="d-md-none mt-4">
					<Col xs={4}>
						<ProductCounter productId={productId} />
					</Col>
					<Col xs={4} className="offset-4">
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

export default CartItem