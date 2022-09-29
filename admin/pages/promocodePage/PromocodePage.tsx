import { Button, Container, Spinner, Table } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useGetPromocodeDetailsQuery } from "../../application/promocode.service"
import Item from "./Item"

const PromocodePage = () => {
    const { id = '' } = useParams()
    const { data, isLoading } = useGetPromocodeDetailsQuery({ id })
    const navigate = useNavigate()

    return (
		<Container>
            <Button className="mb-4 text-muted" variant="link" onClick={() => navigate(-1)}>&larr; назад</Button>
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" />
				</div>
			)}
			{!isLoading && data && <h3>Заказы по промокоду {data.code}</h3>}
			{!isLoading && data && data.orders.length === 0 && <div className="text-muted">Операции с промокодом отсутвуют</div>}
			{!isLoading && data && data.orders.length > 0 && (
				<Table responsive bordered>
					<thead>
						<tr className="align-middle">
							<td>Заказ</td>
							<td className="text-center">Кэшбэк</td>
							<td className="text-center">Сумма заказа</td>
							<td className="text-center">Покупатель</td>
						</tr>
					</thead>
                    <tbody>
                        { data.orders.map(item => (
                            <Item
                                key={item.orderId}
                                buyer={item.buyer}
                                orderCashBack={item.orderCashBack}
                                orderId={item.orderId}
                                orderTotal={item.orderTotal}
                                orderNumber={item.orderNumber}
                            />
                        )) }
                    </tbody>
				</Table>
			)}
		</Container>
	)
}

export default PromocodePage