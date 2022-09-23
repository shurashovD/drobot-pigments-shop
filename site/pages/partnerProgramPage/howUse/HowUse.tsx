import { Button, Col, Row } from "react-bootstrap"

const HowUse = () => {
	const handler = () => {
		document.documentElement.scrollTo({ top: 50, behavior: 'smooth' })
	}

	return (
		<div>
			<div className="text-center fs-3 text-uppercase my-6">Как зарегистрироваться в партнёрской программе?</div>
			<Row className="justify-content-center g-0 gy-4 mb-6">
				<Col xs={12} md={8} xl={3}>
					<div style={{ backgroundColor: "#FDF9EF" }} className="d-flex align-items-center text-dark px-4 py-2">
						<div style={{ fontSize: "64px" }}>1</div>
						<span className="ms-3">Зарегистрироваться/ авторизоваться на сайте </span>
					</div>
				</Col>
				<Col xs={0} xl={1}>
					<div className="h-100 align-items-center justify-content-center d-none d-xl-flex">
						<svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M20 6.26709L-5.29142e-07 6.26709" stroke="#AB9A9A" strokeWidth="0.9" />
							<path d="M14.7772 11.4457L20 6.22289L14.7772 1" stroke="#AB9A9A" strokeWidth="0.9" />
						</svg>
					</div>
				</Col>
				<Col xs={12} md={8} xl={3}>
					<div style={{ backgroundColor: "#FDF9EF" }} className="d-flex align-items-center text-dark px-4 py-2">
						<div style={{ fontSize: "64px" }}>2</div>
						<div className="ms-3">
							<div>Зайти во вкладку </div>
							<div>“Профиль”</div>
						</div>
					</div>
				</Col>
				<Col xs={0} xl={1}>
					<div className="h-100 align-items-center justify-content-center d-none d-xl-flex">
						<svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M20 6.26709L-5.29142e-07 6.26709" stroke="#AB9A9A" strokeWidth="0.9" />
							<path d="M14.7772 11.4457L20 6.22289L14.7772 1" stroke="#AB9A9A" strokeWidth="0.9" />
						</svg>
					</div>
				</Col>
				<Col xs={12} md={8} xl={3}>
					<div style={{ backgroundColor: "#FDF9EF" }} className="d-flex align-items-center text-dark px-4 py-2">
						<div style={{ fontSize: "64px" }}>3</div>
						<div className="ms-3">
							<div>В разделе “Категория покупателя” </div>
							<div>нажать на кнопку “Изменить”</div>
						</div>
					</div>
				</Col>
			</Row>
			<div className="text-muted text-uppercase text-center mb-4">быстрый способ стать партнёром</div>
			<div className="text-center mb-4">
				<svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.73242 20L5.73242 -5.29142e-07" stroke="#AB9A9A" strokeWidth="0.9" />
					<path d="M0.554278 14.7772L5.77711 20L11 14.7772" stroke="#AB9A9A" strokeWidth="0.9" />
				</svg>
			</div>
			<div className="text-center">
				<Button variant="secondary" className="text-primary text-uppercase" onClick={handler}>Отправь заявку сейчас</Button>
			</div>
		</div>
	)
}

export default HowUse