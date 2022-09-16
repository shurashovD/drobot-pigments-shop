import classNames from 'classnames'
import { Button, Col, Collapse, ListGroup, Row } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../../application/hooks'
import { useGetCartQuery, useGetDeliveryDetailQuery } from '../../../application/order.service'
import { setActive } from '../../../application/orderSlice'
import OrderItem from './OrderItem'

const ProductsWrapper = () => {
	const { data: cart } = useGetCartQuery(undefined)
	const { data: deliveryDetail } = useGetDeliveryDetailQuery(undefined)
    const eventKey = "4"
	const { active: activeKey } = useAppSelector((state) => state.orderSlice)
	const disabled = useAppSelector((state) => !state.orderSlice.available.includes(eventKey))
	const empty = useAppSelector((state) => state.orderSlice.empty.includes(eventKey))
	const dispatch = useAppDispatch()
	const formatter = new Intl.NumberFormat('ru', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0
	})

	return (
		<>
			<Button
				id="order-products"
				variant="link"
				onClick={() => dispatch(setActive(eventKey))}
				disabled={disabled}
				className={classNames("order-accordion__btn", { collapsed: activeKey === eventKey, empty: empty })}
			>
				<span className="text-uppercse fs-3">4. Товары в заказе</span>
			</Button>
			<Collapse in={activeKey === eventKey}>
				<div className="mt-2">
					{(!cart || cart?.products.length + cart?.variants.length === 0) && <div className="text-muted">Товары отсутствуют</div>}
					<ListGroup variant="flush">
						{activeKey === "4" &&
							cart?.products
								.filter(({ checked }) => checked)
								.map(({ productId, quantity, price, discountOn, paidByCashBack }) => (
									<OrderItem
										key={productId}
										productId={productId}
										quantity={quantity}
										price={formatter.format(quantity * (price - (discountOn || 0) - (paidByCashBack || 0)))}
									/>
								))}
						{activeKey === "4" &&
							cart?.variants
								.filter(({ checked }) => checked)
								.map(({ productId, variantId, quantity, price, discountOn, paidByCashBack }) => (
									<OrderItem
										key={variantId}
										productId={productId}
										quantity={quantity}
										variantId={variantId}
										price={formatter.format(quantity * (price - (discountOn || 0) - (paidByCashBack || 0)))}
									/>
								))}
						<ListGroup.Item className="bg-transparent px-0">
							<Row>
								<Col xs={4} md={2}>
									Доставка
								</Col>
								<Col xs={4} md={7} className="d-flex justify-content-center align-items-center">
									1 ШТ
								</Col>
								<Col xs={4} md={3} className="fs-3">
									{formatter.format(deliveryDetail?.total_sum || 0)}
								</Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
				</div>
			</Collapse>
		</>
	)
}

export default ProductsWrapper