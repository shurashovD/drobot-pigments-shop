import { Col, Row } from "react-bootstrap"
import Agent from "./Agent"
import Coach from "./Coach"
import Delegate from "./Delegate"

const Variants = () => {
    return (
		<div>
			<div className="fs-3 text-uppercase text-center my-5">
				<span className="white-space text-color-bg">Варианты партнёрства, </span>
				<span className="white-space text-color-bg">Привилегии и условия</span>
				<br />
				<span>партнЁрской программы Drobot pigments</span>
			</div>
			<Row xs={1} lg={3} className="g-5 m-0">
				<Col>
					<Agent />
				</Col>
				<Col>
					<Delegate />
				</Col>
				<Col>
					<Coach />
				</Col>
			</Row>
		</div>
	)
}

export default Variants