import { FC, useEffect, useState } from 'react'
import { Accordion, ListGroup } from 'react-bootstrap'
import { ICart } from '../../../shared'
import { useAppSelector } from '../../application/hooks'
import { useGetCartQuery } from '../../application/order.service'
import OrderItem from './OrderItem'

interface IProps {
	activeKey?: string
	accordionHandler: (key: string) => void
}

const ProductsWrapper: FC<IProps> = ({ accordionHandler, activeKey }) => {
    const { checkedProducts, checkedVariants } = useAppSelector((state) => state.cartSlice)
	const { data: cart } = useGetCartQuery({ checkedProducts, checkedVariants })
    const [products, setProducts] = useState<ICart['products']>([])
    const [variants, setVariants] = useState<ICart['variants']>([])
    const eventKey = "4"

    useEffect(() => {
        if ( cart ) {
            setProducts(cart.products.filter(({ productId }) => checkedProducts.includes(productId)))
            setVariants(cart.variants.filter(({ variantId }) => checkedVariants.includes(variantId)))
        }
    }, [cart, checkedProducts, checkedVariants])

	return (
		<Accordion.Item eventKey={eventKey} className="border-0 border-bottom">
			<Accordion.Header onClick={() => accordionHandler}>
				<span className="text-uppercse fs-3">4. Товары в заказе</span>
			</Accordion.Header>
			<Accordion.Body>
				{products.length + variants.length === 0 && <div className="text-muted">Товары отсутствуют</div>}
				<ListGroup variant="flush">
					{activeKey === "4" &&
						products.map(({ productId, quantity }) => <OrderItem key={productId} productId={productId} quantity={quantity} />)}
					{activeKey === "4" &&
						variants.map(({ productId, variantId, quantity }) => (
							<OrderItem key={variantId} productId={productId} quantity={quantity} variantId={variantId} />
						))}
				</ListGroup>
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default ProductsWrapper
