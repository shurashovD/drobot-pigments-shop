import { Container, Spinner, Table } from "react-bootstrap"
import { useGetCashbackReportQuery } from "../../application/users.service"
import Item from "./Item"

const CashbackPage = () => {
    const { data, isLoading } = useGetCashbackReportQuery({})

    return (
		<Container>
			<h3>Отчет по кэшбэкам</h3>
            {isLoading && <div className="text-center p-3">
                <Spinner animation="border" />
            </div>}
            { !isLoading && data?.length === 0 && <div className="text-muted">Данные отсутсвуют</div> }
			{ !isLoading && data && data?.length > 0 && <Table responsive bordered>
				<thead>
					<tr className="align-items">
						<th>Имя клиента</th>
						<th className="text-center">Промокоды</th>
						<th className="text-center">Сумма кэшбэков</th>
                        <th className="text-center">Полный кэшбэк</th>
                        <th className="text-center">Списано/выплачено</th>
                        <th className="text-center">Остаток</th>
					</tr>
				</thead>
				<tbody>
                    {
                        data.map(item => <Item
                            availableCashBack={item.availableCashBack}
                            clientId={item.clientId}
                            name={item.name}
                            promocodes={item.promocodes}
                            totalCashback={item.totalCashback}
                            totalDebites={item.totalDebites}
                            key={item.clientId}
                        />)
                    }
                </tbody>
			</Table>}
		</Container>
	)
}

export default CashbackPage