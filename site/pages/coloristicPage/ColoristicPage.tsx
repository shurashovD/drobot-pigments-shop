import { useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"

const ColoristicPage = () => {
	useEffect(() => {
		document.title = 'Бесплатная колористика'
	}, [])

    return (
		<Container className="pb-6">
			<div className="d-flex justify-content-center">
				<h3>бесплатная колористика</h3>
			</div>
			<Row className="justify-content-center" id="coloristic-container">
				<Col xs={12} md={10} lg={8} xl={6}>
					<Row xs={2} className="g-4">
						<Col style={{ minHeight: "98px" }}>
							<a
								href="https://drobot-online-academy.ru/drobot_pigments_koloristika" target="_blank"
								className="bg-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100"
							>
								<span className="text-center text-uppercase mb-1">Масштабная колористика Drobot pigments</span>
								<span className="text-muted text-uppercase text-center">Бесплатно в online</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="#" target="_blank"
								className="bg-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100"
							>
								<span className="text-center text-uppercase mb-1">каталог пигментов</span>
								<span className="text-dark text-uppercase text-center text-decoration-underline">Скачать</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="http://"
								className="bg-dark text-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100 coloristic-dark-link"
							>
								<span className="text-center text-uppercase hover-primary">алгоритm подбора пигментов</span>
								<span className="text-white text-uppercase text-center">для бровей</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="http://"
								className="bg-dark text-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100 coloristic-dark-link"
							>
								<span className="text-center text-uppercase hover-primary">алгоритm подбора пигментов</span>
								<span className="text-white text-uppercase text-center">для губ</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="http://"
								className="bg-dark text-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100 coloristic-dark-link"
							>
								<span className="text-center text-uppercase hover-primary">алгоритm подбора пигментов</span>
								<span className="text-white text-uppercase text-center">для век</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="http://"
								className="bg-dark text-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100 coloristic-dark-link"
							>
								<span className="text-center text-uppercase hover-primary">алгоритm подбора</span>
								<span className="text-white text-uppercase text-center">корректоров</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="http://"
								className="bg-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100"
							>
								<span className="text-center text-uppercase">алгоритm подбора пигментов</span>
								<span className="text-uppercase text-center">для трихопигментации</span>
							</a>
						</Col>
						<Col style={{ minHeight: "98px" }}>
							<a
								href="http://"
								className="bg-secondary d-flex flex-column justify-content-center align-items-center p-2 p-md-3 px-md-4 h-100"
							>
								<span className="text-center text-uppercase">алгоритm подбора пигментов</span>
								<span className="text-uppercase text-center">для камуфляжа рубцов</span>
							</a>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	)
}

export default ColoristicPage