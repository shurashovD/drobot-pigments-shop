import { Col, Row } from "react-bootstrap"
import Fird from "./Fird"
import First from "./First"
import Second from "./Second"

const CashBack = () => {
    return (
		<div>
			<div className="text-center fs-3 text-uppercase my-6">Как устроен кэшбэк?</div>
			<Row className="justify-content-center g-4 gy-5">
				<Col xs={12} md={3}>
					<First />
				</Col>
				<Col xs={0} md="auto" className="d-flex">
					<div className="vr h-50 m-auto d-none d-md-block" />
				</Col>
				<Col xs={12} md={3}>
					<Second />
				</Col>
				<Col xs={0} md="auto" className="d-flex">
					<div className="vr h-50 m-auto d-none d-md-block" />
				</Col>
				<Col xs={12} md={3}>
					<Fird />
				</Col>
			</Row>
		</div>
	)
}

export default CashBack