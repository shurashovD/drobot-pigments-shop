import { Col, Row, Spinner } from "react-bootstrap"
import { useGetDiscountQuery } from "../../../application/profile.service"

const PromocodeOrders = () => {
	const { data, isFetching } = useGetDiscountQuery(undefined, { refetchOnMountOrArgChange: true })

	return (
		<div>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{data && (
				<Row className="mb-1">
					<Col xs={9}>Сумма заказов</Col>
					<Col xs={3}>1000Р</Col>
				</Row>
			)}
			{data && (
				<Row className="mb-3 text-muted">
					<Col xs={9}>Всего заказов</Col>
					<Col xs={3}>15</Col>
				</Row>
			)}
        </div>
	)
}

export default PromocodeOrders
