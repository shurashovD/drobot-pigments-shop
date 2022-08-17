import { Card, Col, ListGroup, Row, Spinner } from "react-bootstrap"
import { useGetAllDelegateLoyaltyQuery } from "../../application/loyalty.service"
import DelegateLoyaltyCreate from "./DelegateLoyaltyCreate"
import DelegateLoyaltyItem from "./DelegateLoyaltyItem"

const DelegateLoyalty = () => {
    const { data, isLoading, isError, isFetching } = useGetAllDelegateLoyaltyQuery(undefined)

    return (
		<Card>
			<Card.Header>Представитель</Card.Header>
			<Card.Body>
				{isError && <div className="text-danger">Ошибка получения скидок</div>}
				{isLoading && (
					<div className="text-center p-5">
						<Spinner animation="border" variant="secondary" />
					</div>
				)}
				<ListGroup variant="flush">
					<ListGroup.Item>
						<Row>
							<Col xs={6}>Сумма покупки, руб</Col>
							<Col xs={6}>Размер скидки, %</Col>
						</Row>
					</ListGroup.Item>
					{data?.map(({ id, lowerTreshold, percentValue }) => (
						<ListGroup.Item key={id}>
							<DelegateLoyaltyItem id={id} disabled={isFetching} lowerTreshold={lowerTreshold} percentValue={percentValue} />
						</ListGroup.Item>
					))}
					<ListGroup.Item>
						<DelegateLoyaltyCreate disabled={isFetching} />
					</ListGroup.Item>
				</ListGroup>
			</Card.Body>
		</Card>
	)
}

export default DelegateLoyalty