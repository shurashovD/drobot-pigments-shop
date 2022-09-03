import { FC } from 'react'
import { Accordion, Col, ListGroup, Row } from 'react-bootstrap'
import { useGetCartQuery, useGetDeliveryDetailQuery } from '../../application/order.service'
import OrderItem from './OrderItem'

interface IProps {
	activeKey?: string
	accordionHandler: (key: string) => void
}

const ProductsWrapper: FC<IProps> = ({ accordionHandler, activeKey }) => {
	const { data: cart } = useGetCartQuery(undefined)
	const { data: deliveryDetail } = useGetDeliveryDetailQuery(undefined)
    const eventKey = "4"
	const formatter = new Intl.NumberFormat('ru', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0
	})

	return (
		<Accordion.Item eventKey={eventKey} className="border-0 border-bottom" id="order-products">
			<Accordion.Header onClick={() => accordionHandler(eventKey)}>
				<span className="text-uppercse fs-3">4. Товары в заказе</span>
			</Accordion.Header>
			<Accordion.Body>
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
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default ProductsWrapper
