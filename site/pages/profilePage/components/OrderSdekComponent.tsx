import { FC } from "react"
import { Col, Row, Spinner } from "react-bootstrap"
import { useGetSdekInfoQuery } from "../../../application/profile.service"

const OrderSdekComponent: FC<{ id: string, cost?: number }> = ({ id, cost }) => {
	const { data, isLoading, isError } = useGetSdekInfoQuery(id)
	const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long', year: '2-digit' })
	const currencyFormatter = new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' })

	console.log(data)

    return (
		<div>
			{isLoading && <Spinner variant="secondary" animation="border" />}
			{isError && <div className="text-muted">Ошибка получения информации от СДЭК</div>}
			{data && (
				<div>
					<div className="mb-3">
						<span className="text-muted">Доставка:</span> <span>СДЭК,</span>{" "}
						{(data.delivery_mode === "1" || data.delivery_mode === "3") && <span>Курьер</span>}
						{(data.delivery_mode === "2" || data.delivery_mode === "4") && <span>Офис</span>}
						{(data.delivery_mode === "6" || data.delivery_mode === "7") && <span>Постамат</span>}
					</div>
					<div className="mb-3">
						<span className="text-muted">Адрес:</span> <span>{data.to_location.address}</span>
					</div>
					<Row className="mb-3">
						<Col xs="auto">
							<span className="text-muted">Получатель:</span>
						</Col>
						<Col xs="auto">
							<div>{data.recipient.name}</div>
							<div>{data.recipient.number}</div>
						</Col>
					</Row>
					{data.delivery_detail?.date && <div className="mb-3">
						<span className="text-muted">Дата доставки:</span> <span>{formatter.format(Date.parse(data.delivery_detail.date))}</span>
					</div>}
					<div className="mb-3">
						<span className="text-muted">Стоимость доставки:</span>{" "}
						{cost ? <span>{currencyFormatter.format(cost)}</span> : <span>Не определено</span>}
					</div>
				</div>
			)}
		</div>
	)
}

export default OrderSdekComponent