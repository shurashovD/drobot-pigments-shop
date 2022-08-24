import { useEffect, useState } from "react"
import { Button, Col, Container, Form, ListGroup, Row, Spinner } from "react-bootstrap"
import { resetCheckAll, toggleCheckAll } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useDeleteFromCartMutation, useGetCartQuery } from "../../application/order.service"
import CartItem from "./CartItem"
import CartTotal from "./CartTotal"
import VariantCartItem from "./VariantCartItem"

const CartPage = () => {
    const [label, setLabel] = useState<'товар' | 'товара' | 'товаров'>()
	const { checkedProducts, checkedVariants } = useAppSelector((state) => state.cartSlice)
	const { data, isLoading } = useGetCartQuery({ checkedProducts, checkedVariants }, { refetchOnMountOrArgChange: true })
	const [remove, { isLoading: rmLoading }] = useDeleteFromCartMutation()
	const dispatch = useAppDispatch()
	const [checked, setChecked] = useState(false)

	const rmHandler = () => {
		remove({ productIds: checkedProducts, variantIds: checkedVariants })
		dispatch(resetCheckAll())
	}

	const toggleChekAllHandler = () => {
		const cartProductsIds = data?.products.map(({ productId }) => productId) || []
		const cartVariantsIds = data?.variants.map(({ variantId }) => variantId) || []
		dispatch(toggleCheckAll({ cartProductsIds, cartVariantsIds }))
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
			const allProductsChecked = products.map(({ productId }) => (productId)).every(item => checkedProducts.includes(item)) || products.length === 0
			const allVariantsChecked =
				variants.map(({ variantId }) => variantId).every((item) => checkedVariants.includes(item)) || variants.length === 0
			setChecked((products.length + variants.length > 0) && allVariantsChecked && allProductsChecked)
		}
	}, [data, checkedProducts, checkedVariants])

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
						<Row className="m-0">
							<Col xs={"auto"} className="ps-4">
								<Form.Check
									label="Выбрать все"
									className="align-item-center m-0"
									onChange={toggleChekAllHandler}
									checked={checked}
									disabled={rmLoading}
								/>
							</Col>
							<Col xs={"auto"}>
								<Button
									variant="link"
									className="text-muted m-0 p-0 border-0 border-bottom border-2 border-gray"
									disabled={(checkedProducts.length === 0 && checkedVariants.length === 0) || rmLoading}
									onClick={rmHandler}
								>
									Удалить выбранные
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			)}
			{data && data.products.length + data.variants.length === 0 && <p className="text-muted">Коризна пуста</p>}
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