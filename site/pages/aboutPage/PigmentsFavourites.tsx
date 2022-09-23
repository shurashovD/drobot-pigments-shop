import { Col, Row } from "react-bootstrap"

const PigmentsFavourites = () => {
    return (
		<Row className="g-5" xs={1} md={2} xl={3}>
			<Col>
				<Row className="m-0 border-bottom border-dark">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<div className="text-dark text-center" style={{ fontSize: "90px" }}>
							1
						</div>
					</Col>
					<Col xs={10} className="d-flex justify-content-center align-items-center">
						<div className="text-uppercase text-center">
							<span className="text-dark">Плотные</span> - имеют хорошую покрывающую способность.
						</div>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row className="m-0 border-bottom border-dark">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<div className="text-dark text-center" style={{ fontSize: "90px" }}>
							2
						</div>
					</Col>
					<Col xs={10} className="d-flex justify-content-center align-items-center">
						<div className="text-uppercase text-center">
							Пигмент <span className="text-dark">жидкий</span>, не требует дополнительного разбавления.
						</div>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row className="m-0 border-bottom border-dark">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<div className="text-dark text-center" style={{ fontSize: "90px" }}>
							3
						</div>
					</Col>
					<Col xs={10} className="d-flex justify-content-center align-items-center">
						<div className="text-uppercase text-center">
							<span className="text-dark">Не сохнет</span> во время работы,{" "}
							<span className="white-space">
								хорошо <span className="text-dark">стирается!</span>
							</span>
						</div>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row className="m-0 border-bottom border-dark">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<div className="text-dark text-center" style={{ fontSize: "90px" }}>
							4
						</div>
					</Col>
					<Col xs={10} className="d-flex justify-content-center align-items-center">
						<div className="text-uppercase text-center">
							При нетравматичной работе <span className="text-dark white-space">остаток пигмента</span> в коже при заживлении -{" "}
							<span className="text-dark">90-100%</span>
						</div>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row className="m-0 border-bottom border-dark">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<div className="text-dark text-center" style={{ fontSize: "90px" }}>
							5
						</div>
					</Col>
					<Col xs={10} className="d-flex justify-content-center align-items-center">
						<div className="text-uppercase text-center">
							<span className="text-dark">высококонцентрированные,</span> <span className="text-dark">яркие</span> - это возможность
							быстро и легко укладывать их в кожу.
						</div>
					</Col>
				</Row>
			</Col>
			<Col>
				<Row className="m-0 border-bottom border-dark">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<div className="text-dark text-center" style={{ fontSize: "90px" }}>
							6
						</div>
					</Col>
					<Col xs={10} className="d-flex justify-content-center align-items-center">
						<div className="text-uppercase text-center">
							Для <span className="text-dark">поверхностных</span> техник работы!
						</div>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}

export default PigmentsFavourites