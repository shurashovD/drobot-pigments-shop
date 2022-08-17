import { Card, Col, ListGroup, Row, Spinner } from "react-bootstrap"
import { useGetAllCommonLoyaltyQuery } from "../../application/loyalty.service"
import CommonLoyaltyCreate from "./CommonLoyaltyCreate"
import CommonLoyaltyItem from "./CommonLoyaltyItem"

const CommonLoyalty = () => {
    const { data, isLoading, isError, isFetching } = useGetAllCommonLoyaltyQuery(undefined)

    return (
		<Card>
			<Card.Header>Розничный покупатель</Card.Header>
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
							<CommonLoyaltyItem id={id} disabled={isFetching} lowerTreshold={lowerTreshold} percentValue={percentValue} />
						</ListGroup.Item>
					))}
					<ListGroup.Item>
						<CommonLoyaltyCreate disabled={isFetching} />
					</ListGroup.Item>
				</ListGroup>
			</Card.Body>
		</Card>
	)
}

export default CommonLoyalty