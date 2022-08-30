import { FC, useState } from 'react'
import { Accordion, ListGroup } from 'react-bootstrap'
import { ICart } from '../../../shared'
import { useGetCartQuery } from '../../application/order.service'
import OrderItem from './OrderItem'

interface IProps {
	activeKey?: string
	accordionHandler: (key: string) => void
}

const ProductsWrapper: FC<IProps> = ({ accordionHandler, activeKey }) => {
	const { data: cart } = useGetCartQuery(undefined)
    const eventKey = "4"

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
							.map(({ productId, quantity }) => <OrderItem key={productId} productId={productId} quantity={quantity} />)}
					{activeKey === "4" &&
						cart?.variants
							.filter(({ checked }) => checked)
							.map(({ productId, variantId, quantity }) => (
								<OrderItem key={variantId} productId={productId} quantity={quantity} variantId={variantId} />
							))}
				</ListGroup>
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default ProductsWrapper
