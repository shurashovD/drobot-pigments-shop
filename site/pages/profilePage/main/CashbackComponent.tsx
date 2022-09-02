import { Col, Row, Spinner } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"
import { NavLink } from 'react-router-dom'

const CashbackComponent = () => {
	const { data, isFetching } = useAccountAuthQuery(undefined)
	const formatter = new Intl.NumberFormat('ru', {
		style: 'decimal'
	})

	return (
		<div>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{!isFetching && data && (
				<Row className="mb-1">
					<Col xs={9}>Активный кэшбэк</Col>
					<Col xs={3}>{formatter.format(data.cashBack || 0)}Р</Col>
				</Row>
			)}
			{!isFetching && data && (
				<Row className="mb-3 text-muted">
					<Col xs={9}>За всё время</Col>
					<Col xs={3}>{formatter.format(data.totalCashBack || 0)}Р</Col>
				</Row>
			)}
			{!isFetching && data && (
				<NavLink to={"/profile#main"} className="btn btn-link border border-dark text-primary d-none">
					Вывести кэш
				</NavLink>
			)}
		</div>
	)
}

export default CashbackComponent
