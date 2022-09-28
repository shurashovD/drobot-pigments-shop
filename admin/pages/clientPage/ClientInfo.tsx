import { FC } from "react"
import { Col, Row } from "react-bootstrap"

interface IProps {
    name: string
    totalCashBack: number
    availableCashBack: number
}

const ClientInfo: FC<IProps> = ({ availableCashBack, name, totalCashBack }) => {
    return (
		<Row className="justify-content-between">
			<Col xs="auto" className="d-flex align-items-center">
				<h3 className="m-0">{name}</h3>
			</Col>
			<Col xs="auto" className="d-flex flex-column justify-content-center align-items-end">
				<div>Доступный кэшбэк: {availableCashBack}</div>
				<div className="text-muted">Кэшбэк за всё время: {totalCashBack}</div>
			</Col>
		</Row>
	)
}

export default ClientInfo