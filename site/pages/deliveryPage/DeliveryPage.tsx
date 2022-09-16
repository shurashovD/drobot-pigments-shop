import { Col, Container, Row } from "react-bootstrap"
import Descriprion from "./Descriprion"
import Pickup from "./Pickup"
import PostRF from "./PostRF"
import Sdek from "./Sdek"

const DeliveryPage = () => {
    return (
		<Container className="pb-6">
			<h3>Доставка</h3>
			<Row className="g-5">
				<Col xs={12} lg={6} className="mb-6 mb-lg-0">
					<Sdek />
				</Col>
				<Col xs={12} lg={6}>
					<PostRF />
				</Col>
				<Col xs={12}>
					<Pickup />
				</Col>
			</Row>
			<Descriprion />
		</Container>
	)
}

export default DeliveryPage