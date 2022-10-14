import { useEffect } from "react"
import { Accordion, Col, Container, Row } from "react-bootstrap"
import BannerComponent from "../../components/BannerComponent"
import Fird from "./Fird"
import First from "./First"
import Fourth from "./Fourth"
import Second from "./Second"

const GaranteesAndRefund = () => {
	useEffect(() => {
		document.title = 'Гарантии и возврат'
	}, [])

	return (
		<Container className="p-0" fluid>
			<BannerComponent folder="garanteesPage" mobileWidthToHeight={414 / 550} widthToHeight={1440 / 450} />
			<Container className="mt-5 mb-6">
				<Accordion className="custom-accordion" flush>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Гарантии интернет-магазина DROBOT PIGMENTS SHOP</Accordion.Header>
						<Accordion.Body>
							<First />
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>Гарантийное обслуживание и ремонт</Accordion.Header>
						<Accordion.Body>
							<Second />
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="3">
						<Accordion.Header>Возврат и обмен оборудования</Accordion.Header>
						<Accordion.Body>
							<Fird />
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="4">
						<Accordion.Header>Возврат денежных средств на карту</Accordion.Header>
						<Accordion.Body>
							<Fourth />
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="5">
						<Accordion.Header>Товар, приобретенный со скидкой</Accordion.Header>
						<Accordion.Body>
							<p>
								Только товар, приобретенный по полной фиксированной цене, подлежит возврату. К сожалению, мы не не можем принять от
								Вас товар, купленный со скидкой, предоставляемой по специальной акции. Товары, приобретенные с учетом накопительной
								скидки, подлежат возврату или обмену в обычном порядке. DROBOT PIGMENTS SHOP: возврат товаров в других случаях
							</p>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
				<Row className="bg-secondary p-3 p-md-5 py-6 w-100 w-lg-75 mt-6 mx-0">
					<Col xs={12}>
						<p className="fw-bold">Не нашли интересующей вас информации?</p>
					</Col>
					<Col xs={12}>
						<p>
							Свяжитесь с нашими менеджерами для разрешения возникшего вопроса.
							<br />
							Мы ценим внимание покупателей и гарантируем серьезный профессиональный подход, независимо от стоимости покупки.
							<br />
							Если вам нужно осуществить возврат товаров, то мы всегда готовы пойти навстречу клиенту.
						</p>
					</Col>
					<Col xs={12}>
						<p>Свяжитесь с нами любым удобным способом, и консультанты гипермаркета сделают все возможное, чтобы помочь вам.</p>
					</Col>
					<Col xs={12} lg={6} xl={4} className="mb-4 mb-lg-0">
						<div className="text-dark mb-2">Служба поддержки клиентов: </div>
						<a href="tel:+79189787010">+7(918)97-87-010</a>
					</Col>
					<Col xs={12} lg={6} xl={4}>
						<div className="text-dark mb-2">Почта: </div>
						<a href="mailto:drobot.shop@yandex.ru">drobot.shop@yandex.ru</a>
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default GaranteesAndRefund
