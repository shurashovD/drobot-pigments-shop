import { Col, Container, Row } from "react-bootstrap"
import AgentLoyalty from "./AgentLoyalty"
import CommonLoyalty from "./CommonLoyalty"
import DelegateLoyalty from "./DelegateLoyalty"

const LoyaltyPage = () => {
    return (
        <Container>
			<h3>Программа лояльности</h3>
            <Row xs={1} lg={3} className="g-4">
                <Col>
                    <CommonLoyalty />
                </Col>
                <Col>
                    <AgentLoyalty />
                </Col>
                <Col>
                    <DelegateLoyalty />
                </Col>
            </Row>
        </Container>
    )
}

export default LoyaltyPage