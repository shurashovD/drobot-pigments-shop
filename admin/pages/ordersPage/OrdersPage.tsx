import { Container, Spinner, Table } from "react-bootstrap"
import { useGetOrdersQuery } from "../../application/order.service"
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
    const { data, isLoading } = useGetOrdersQuery({}, { refetchOnMountOrArgChange: true })
    
    return (
		<Container>
			<h3>Заказы</h3>
			{isLoading && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{data && (
				<Table>
					<thead>
						<tr>
							<th>Номер</th>
							<th>Заказчик</th>
							<th className="text-center">Телефон</th>
							<th className="text-center">Адрес</th>
							<th className="text-center">Почта</th>
							<th className="text-center">Статус</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item) => (
							<Item
								key={item._id?.toString()}
								id={item._id?.toString() || ""}
								number={item.number.toString()}
								address={item.address}
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