import { FC, useRef } from "react"
import { Button, Col, Form, ListGroup, Row, Spinner } from "react-bootstrap"
import { setQuantity, setVariantQuantity, toggleCheckVariantInCart } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useGetVariantQuery } from "../../application/product.service"
import ProductCounter from "../../components/card/ProductCounter"
import VariantCounter from "../../components/card/VariantCounter"
import IconDelete from "../../components/icons/IconDelete"
import IconFavourite from "../../components/icons/IconFavourite"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
    disabled?: boolean
    productId: string
	variantId: string
}

const VariantCartItem: FC<IProps> = ({ disabled, productId, variantId }) => {
    const { data, isLoading } = useGetVariantQuery({ productId, variantId }, { refetchOnMountOrArgChange: true })
	const checked = useAppSelector(state => state.cartSlice.variants.find(item => item.variantId === variantId)?.checked || false)
    const dispatch = useAppDispatch()
    const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 2,
		})
	)

	const handler = () => {
		dispatch(toggleCheckVariantInCart(variantId))
	}

    return (
		<ListGroup.Item className="py-4">
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
							onChange={handler}
						/>
					</Col>
					<Col xs={4} md={2} className="px-md-0">
						<div className="position-relative">
							<ImageComponent
								src={data.photo || "/static"}
							/>
							<Form.Check
								disabled={disabled}
								onChange={handler}
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
							<VariantCounter
								productId={productId}
								variantId={variantId}
								disabled={disabled}
							/>
						</div>
					</Col>
					<Col
						xs={4}
						md={4}
						className="d-flex flex-column justify-content-between align-items-end"
					>
						{typeof data.price !== "undefined" && (
							<div className="fs-3">
								{formatter.current.format(data.price / 100)}
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
								onClick={() =>
									dispatch(
										setVariantQuantity({ variantId, quantity: 0 })
									)
								}
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
						<VariantCounter
							productId={productId}
							variantId={variantId}
							disabled={disabled}
						/>
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
								onClick={() =>
									dispatch(
										setVariantQuantity({ variantId, quantity: 0 })
									)
								}
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

export default VariantCartItem