import { FC, useRef } from "react"
import { Button, Col, Form, ListGroup, Row, Spinner } from "react-bootstrap"
import { setCartBusy, toggleCheckInCart } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useDeleteFromCartMutation } from "../../application/order.service"
import { useGetProductByIdQuery } from "../../application/product.service"
import ProductCounter from "../../components/card/ProductCounter"
import IconDelete from "../../components/icons/IconDelete"
import IconFavourite from "../../components/icons/IconFavourite"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
	productId: string
}

const CartItem: FC<IProps> = ({ productId }) => {
    const { data, isLoading } = useGetProductByIdQuery(productId, { refetchOnMountOrArgChange: true })
	const [remove] = useDeleteFromCartMutation()
	const checked = useAppSelector(state => state.cartSlice.products.find(item => item.productId === productId)?.checked || false)
	const disabled = useAppSelector(state => state.cartSlice.cartBusy)
	const dispatch = useAppDispatch()
    const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
		})
	)

	const rmHandler = () => {
		dispatch(setCartBusy(true))
		remove({ productIds: [productId], variantIds: [] })
	}

    return (
		<ListGroup.Item className="py-4 bg-transparent">
			{isLoading && (
				<div className="text-center p-4">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && data && (
				<Row>
					<Col xs={0} md={1} className="d-flex align-items-center">
						<Form.Check
							checked={checked}
							className="d-none d-md-block"
							disabled={disabled}
							onChange={() =>
								dispatch(toggleCheckInCart(productId))
							}
						/>
					</Col>
					<Col xs={4} md={2} className="px-md-0">
						<div className="position-relative">
							<ImageComponent
								src={data.photo?.[0] || "/static"}
							/>
							<Form.Check
								checked={checked}
								disabled={disabled}
								onChange={() =>
									dispatch(toggleCheckInCart(productId))
								}
								className="d-md-none position-absolute top-0 start-0 m-2"
							/>
						</div>
					</Col>
					<Col
						xs={4}
						md={5}
						className="d-flex flex-column justify-content-between"
					>
						<span>{data.name}</span>
						<div className="d-none d-md-block">
							<ProductCounter productId={productId} />
						</div>
					</Col>
					<Col
						xs={4}
						md={4}
						className="d-flex flex-column justify-content-between align-items-end"
					>
						{typeof data.price !== "undefined" && (
							<div className="fs-3">
								{formatter.current.format(data.price)}
							</div>
						)}
						<div className="w-100 d-none d-md-flex justify-content-between">
							<Button
								variant="link"
								className="text-start w-100 m-0 p-0"
								disabled={disabled}
							>
								В избранное
							</Button>
							<Button
								disabled={disabled}
								variant="link"
								className="text-end w-100 m-0 p-0"
								onClick={rmHandler}
							>
								Удалить
							</Button>
						</div>
					</Col>
				</Row>
			)}
			{!isLoading && data && (
				<Row className="d-md-none mt-4">
					<Col xs={4}>
						<ProductCounter productId={productId} />
					</Col>
					<Col xs={4} className="offset-4">
						<div className="w-100 d-flex d-md-none justify-content-between">
							<Button
								variant="link"
								className="text-start w-100 m-0 p-0"
								disabled={disabled}
							>
								<IconFavourite stroke="#9E9E9E" />
							</Button>
							<Button
								disabled={disabled}
								variant="link"
								className="text-end w-100 m-0 p-0"
								onClick={rmHandler}
							>
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