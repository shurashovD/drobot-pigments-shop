import { useState } from 'react'
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"
import CashOutModal from './CashOutModal'

const CashbackComponent = () => {
	const { data, isFetching } = useAccountAuthQuery(undefined)
	const [showModal, setShowModal] = useState(false)
	const formatter = new Intl.NumberFormat('ru', {
		style: 'decimal'
	})

	return (
		<div>
			<CashOutModal onHide={() => setShowModal(false)} show={showModal} />
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
				<Button variant="link" className="border border-dark text-primary" onClick={() => setShowModal(true)}>
					Вывести кэш
				</Button>
			)}
		</div>
	)
}

export default CashbackComponent
