import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../application/account.service"
import OrderComponent from "./components/OrderComponent"

const Orders = () => {
    const navigate = useNavigate()
    const { data } = useAccountAuthQuery(undefined)

    return (
		<Container>
			<Button variant="link" className="text-muted mb-5 d-md-none" onClick={() => navigate(-1)}>
				<span className="me-2">&larr;</span> назад
			</Button>
			{data && (
				<Row>
					<Col xs={12} lg={9}>
						{data.orders.length === 0 && <div className="text-muted">Заказов пока нет</div>}
						{data.orders.map((item) => (
							<OrderComponent id={item.toString()} key={item.toString()} />
						))}
					</Col>
					<Col xs={0} lg={3}>
						
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default Orders