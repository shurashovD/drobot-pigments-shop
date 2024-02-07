import { Badge, Container, ListGroup, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetOrderByIdQuery } from "../../application/order.service"
import { NavLink } from "react-router-dom"

const OrderPage = () => {
    const {id} = useParams()
    const { data, isLoading } = useGetOrderByIdQuery(id || '', { refetchOnMountOrArgChange: true })

    return (
		<Container>
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{data && (
				<Container>
					<h3>
						Заказ №{data.number} от {data.date} на сумму{" "}
						{data.total / 100}
					</h3>
					<p>
						Клиент: {data.client?.name} {data.client?.tel}
					</p>
					{data.promocode && <p>
						<NavLink to={`/admin/promocode/${data.promocode}`}>С промокодом</NavLink>
					</p>}
					<ListGroup>
						{data.products.map(({ product, quantity }, index) => (
							<ListGroup.Item key={`order-product_${index}`}>
								<div className="hstack justify-content-between gap-3">
									<span>{product?.name}</span>
									<Badge>{quantity}</Badge>
								</div>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Container>
			)}
		</Container>
	)
}

export default OrderPage