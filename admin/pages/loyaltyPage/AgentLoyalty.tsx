import { Card, Col, ListGroup, Row, Spinner } from "react-bootstrap"
import { useGetAllAgentLoyaltyQuery } from "../../application/loyalty.service"
import AgentLoyaltyItem from "./AgentLoyaltyItem"

const AgentLoyalty = () => {
    const { data, isLoading, isError, isFetching } = useGetAllAgentLoyaltyQuery(undefined)

    return (
		<Card>
			<Card.Header>Агент</Card.Header>
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
							<Col xs={12}>Размер скидки, %</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<AgentLoyaltyItem disabled={isFetching} percentValue={data?.percentValue?.toString()} />
					</ListGroup.Item>
				</ListGroup>
			</Card.Body>
		</Card>
	)
}

export default AgentLoyalty