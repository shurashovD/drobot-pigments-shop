import { useEffect, useState } from "react"
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap"
import { rmChecked, toggleCheckAll } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useLazyGetCartTotalQuery } from "../../application/order.service"
import CartItem from "./CartItem"
import CartTotal from "./CartTotal"
import VariantCartItem from "./VariantCartItem"

const CartPage = () => {
    const [label, setLabel] = useState<'товар' | 'товара' | 'товаров'>()
	const [trigger, { isFetching, data: cartTotal }] = useLazyGetCartTotalQuery()
    const { products, variants } = useAppSelector(state => state.cartSlice)
	const dispatch = useAppDispatch()

    useEffect(() => {
		const checkedProducts = products
			.filter(({ checked }) => checked)
			.map(({ productId, quantity }) => ({ productId, quantity }))
		const checkedVariants = variants
			.filter(({ checked }) => checked)
			.map(({ productId, quantity, variantId }) => ({ productId, quantity, variantId }))
		trigger({ products: checkedProducts, variants: checkedVariants })
		
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
	}, [products, variants])

    return (
		<Container className="pb-6">
			<div className="d-flex align-items-baseline">
				<h3>Корзина</h3>
				<span className="ms-2 text-muted">
					{products.reduce(
						(total, { quantity }) => total + quantity,
						0
					) +
						variants.reduce(
							(total, { quantity }) => total + quantity,
							0
						)}{" "}
					{label}
				</span>
			</div>
			{products.length + variants.length > 0 && (
				<Row>
					<Col xs={12} lg={8}>
						<Row className="m-0">
							<Col xs={"auto"} className="ps-4">
								<Form.Check
									label="Выбрать все"
									className="align-item-center m-0"
									onChange={() => dispatch(toggleCheckAll())}
									checked={
										products.every(({ checked }) => checked) &&
										variants.every(({ checked }) => checked)
									}
									disabled={isFetching}
								/>
							</Col>
							<Col xs={"auto"}>
								<Button
									variant="link"
									className="text-muted m-0 p-0 border-0 border-bottom border-2 border-gray"
									disabled={isFetching}
									onClick={() => dispatch(rmChecked())}
								>
									Удалить выбранные
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			)}
			{products.length + variants.length === 0 ? (
				<p className="text-muted">Коризна пуста</p>
			) : (
				<Row>
					<Col xs={12} lg={8}>
						<hr className="mb-0" />
						<ListGroup variant="flush" className="p-0">
							{products.map((item) => (
								<CartItem
									key={item.productId}
									productId={item.productId}
									disabled={isFetching}
								/>
							))}
							{variants.map((item) => (
								<VariantCartItem
									key={item.variantId}
									productId={item.productId}
									variantId={item.variantId}
									disabled={isFetching}
								/>
							))}
						</ListGroup>
						<hr />
					</Col>
					<Col xs={12} lg={4}>
						<CartTotal isLoading={isFetching} total={cartTotal} />
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default CartPage