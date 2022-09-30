import { Container, Spinner, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetDebitesReportQuery } from "../../application/users.service"
import Item from "./Item"

const DebitesPage = () => {
    const { id = '' } = useParams()
    const { data, isLoading } = useGetDebitesReportQuery({ id })

    return (
		<Container>
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" />
				</div>
			)}
			{!isLoading && data && <h3>Списания и выплаты клиента {data.name}</h3>}
			{!isLoading && data && data.debites.length === 0 && <div className="text-muted">Списания и выплаты не найдены</div>}
			{!isLoading && data && data.debites.length > 0 && (
				<Table>
					<thead>
						<tr className="align-middle">
							<th>Дата</th>
							<th className="text-center">Сумма списания/выплаты</th>
							<th className="text-center">Тип операции</th>
							<th className="text-center">Заказ</th>
							<th className="text-center">Сумма заказа</th>
						</tr>
					</thead>
                    <tbody>
						{
							data.debites.map((item, index) => (
								<Item
									key={`${data.name}_${index}`}
									date={item.date}
									debite={item.debite}
									order={item.order}
									orderId={item.orderId}
									orderTotal={item.orderTotal}
								/>
							))
						}
                    </tbody>
				</Table>
			)}
		</Container>
	)
}

export default DebitesPage