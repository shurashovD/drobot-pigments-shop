import { useEffect } from "react"
import { Container, Spinner, Table } from "react-bootstrap"
import { useAppSelector } from "../../application/hooks"
import Item from "./Item"

const statusDecoder = (status: string) => {
    if (status === 'new') return 'Не обработано'
    if (status === "isReading") return "Ждет выполнения"
    if (status === "compiling") return "Собирается"
    if (status === "deliveried") return "Доставляется"
    if (status === "complete") return "Завершено"
    return "Не определено"
}

const OrdersPage = () => {
	const { orders } = useAppSelector(state => state.ordersSlice)
    
    return (
		<Container>
			<h3>Заказы</h3>
			{orders && (
				<Table>
					<thead>
						<tr>
							<th>Номер</th>
							<th>Дата</th>
							<th>Заказчик</th>
							<th className="text-center">Телефон</th>
							<th className="text-center">Почта</th>
							<th className="text-center">Статус</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((item) => (
							<Item
								key={item.id}
								date={item.date}
								id={item.id}
								new={item.status === "new"}
								number={item.number.toString()}
								client={item.client.name}
								mail={item.client.mail}
								phone={item.client.tel}
								status={statusDecoder(item.status)}
							/>
						))}
					</tbody>
				</Table>
			)}
		</Container>
	)
}

export default OrdersPage