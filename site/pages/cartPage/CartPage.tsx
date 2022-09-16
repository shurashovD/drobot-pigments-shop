import { useEffect, useState } from "react"
import { Button, Col, Container, Fade, ListGroup, Row, Spinner } from "react-bootstrap"
import { useDeleteFromCartMutation, useGetCartQuery, useResetCheckProductsMutation, useToggleCheckAllMutation } from "../../application/order.service"
import CheckboxComponent from "../../components/CheckboxComponent"
import CartItem from "./CartItem"
import CartTotal from "./CartTotal"
import VariantCartItem from "./VariantCartItem"

const CartPage = () => {
    const [label, setLabel] = useState<'товар' | 'товара' | 'товаров'>()
	const { data, isLoading } = useGetCartQuery(undefined, { refetchOnMountOrArgChange: true })
	const [remove, { isLoading: rmLoading }] = useDeleteFromCartMutation()
	const [resetCheck] = useResetCheckProductsMutation()
	const [toggleChekAll, { isLoading: checkAllLoading }] = useToggleCheckAllMutation()
	const [checked, setChecked] = useState(false)

	const rmHandler = () => {
		if ( data ) {
			const productIds = data.products.filter(({ checked }) => (checked)).map(({ productId }) => (productId))
			const variantIds = data.variants.filter(({ checked }) => checked).map(({ variantId }) => variantId)
			remove({ productIds, variantIds })
		}
	}

	useEffect(() => {
		if ( data ) {
			const { products, variants } = data
			const productsLength =
				products.reduce((total, { quantity }) => total + quantity, 0) +
				variants.reduce((total, { quantity }) => total + quantity, 0)
			const lastSymbol = parseInt(
				productsLength.toString()[productsLength.toString().length - 1]
			)
			if (lastSymbol > 4 || lastSymbol === 0) {
				setLabel("товаров")
			} else {
				if (lastSymbol === 1) {
					setLabel("товар")
				} else {
					setLabel("товара")
				}
			}
			const allProductsChecked = products.every(({ checked }) => checked) || products.length === 0
			const allVariantsChecked = variants.every(({ checked }) => checked) || variants.length === 0
			setChecked((products.length + variants.length > 0) && allVariantsChecked && allProductsChecked)
		}
	}, [data])

	useEffect(() => {
		resetCheck()
	}, [resetCheck])

    return (
		<Container className="pb-6">
			{isLoading && (
				<div className="text-center p-5">
					<Spinner animation="border" variant="primary" />
				</div>
			)}
			{data && (
				<div className="d-flex align-items-baseline">
					<h3>Корзина</h3>
					<span className="ms-2 text-muted">
						{data.products.reduce((total, { quantity }) => total + quantity, 0) +
							data.variants.reduce((total, { quantity }) => total + quantity, 0)}{" "}
						{label}
					</span>
				</div>
			)}
			{data && data.products.length + data.variants.length > 0 && (
				<Row>
					<Col xs={12} lg={8}>
						<Row className="m-0 g-0">
							<Col xs="auto" className="pe-3">
								<CheckboxComponent
									isLoading={checkAllLoading}
									label="Выбрать все"
									onChange={() => toggleChekAll()}
									checked={checked}
									disabled={rmLoading || checkAllLoading}
								/>
							</Col>
							<Col xs={"auto"} className="d-flex align-items-center">
								<Fade in={checked}>
									<Button
										variant="link"
										className="text-muted m-0 p-0 border-0 border-bottom border-2 border-gray"
										disabled={rmLoading}
										onClick={rmHandler}
									>
										Удалить выбранные
									</Button>
								</Fade>
							</Col>
						</Row>
					</Col>
				</Row>
			)}
			{data && data.products.length + data.variants.length === 0 && <p className="text-muted">Корзина пуста</p>}
			{!rmLoading && data && data.products.length + data.variants.length > 0 && (
				<Row>
					<Col xs={12} lg={8}>
						<hr className="mb-0" />
						<ListGroup variant="flush" className="p-0 bg-transparent">
							{data.products.map((item) => (
								<CartItem key={item.productId} productId={item.productId} />
							))}
							{data.variants.map((item) => (
								<VariantCartItem key={item.variantId} productId={item.productId} variantId={item.variantId} />
							))}
						</ListGroup>
						<hr />
					</Col>
					<Col xs={12} lg={4}>
						<CartTotal />
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default CartPage