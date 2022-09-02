import { Button, Col, Row, Spinner } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"
import { NavLink } from 'react-router-dom'

const CashbackComponent = () => {
	const { data, isFetching } = useAccountAuthQuery(undefined)

	return (
		<div>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{data && (
				<Row className="mb-1">
					<Col xs={9}>Активный кэшбэк</Col>
					<Col xs={3}>1000Р</Col>
				</Row>
			)}
			{data && (
				<Row className="mb-3 text-muted">
					<Col xs={9}>За всё время</Col>
					<Col xs={3}>1000Р</Col>
				</Row>
			)}
			{data && (
				<NavLink to={"/profile#main"} className="btn btn-link border border-dark text-primary d-none">
					Вывести кэш
				</NavLink>
			)}
		</div>
	)
}

export default CashbackComponent
