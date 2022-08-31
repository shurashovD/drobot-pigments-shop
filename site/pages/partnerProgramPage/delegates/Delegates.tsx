import { Col, Row } from "react-bootstrap"

const Delegates = () => {
    return (
		<div>
			<div className="text-center fs-3 text-uppercase my-6">Какая система скидок у представителей?</div>
			<Row className="justify-content-center g-4">
				<Col xs={12} md={3}>
					<div className="bg-dark p-4 text-white">
						<div className="text-center fs-3">
							20<span className="fs-6">%</span>
						</div>
						<div className="text-center">
							<small>при покупке от 20 000Р </small>
						</div>
					</div>
				</Col>
				<Col xs={12} md={3}>
					<div className="bg-dark p-4 text-white">
						<div className="text-center fs-3">
							30<span className="fs-6">%</span>
						</div>
						<div className="text-center">
							<small>при покупке от 50 000Р </small>
						</div>
					</div>
				</Col>
				<Col xs={12} md={3}>
					<div className="bg-dark p-4 text-white">
						<div className="text-center fs-3">
							35<span className="fs-6">%</span>
						</div>
						<div className="text-center">
							<small>при покупке от 100 000Р </small>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default Delegates