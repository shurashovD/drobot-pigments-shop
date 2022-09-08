import { Col, Container, Row } from "react-bootstrap"

const ContactsPage = () => {
    return (
		<Container className="pb-6">
			<h3>Контакты</h3>
			<Row className="g-5">
				<Col xs={12} lg={6}>
					<div className="bg-white p-4 py-5 p-lg-6 h-100">
						<div className="text-uppercase text-dark mb-5">Контакты</div>
						<div className="mb-4 mb-lg-5 text-muted">
							Служба поддержки клиентов: <br className="d-lg-none" />
							<a href="tel:+79189787010" className="text-primary">
								+7(918)97-87-010
							</a>
						</div>
						<div className="mb-4 mb-lg-5 text-muted">
							Почта:{" "}
							<a href="mailto:drobot.shop@yandex.ru" className="text-primary">
								drobot.shop@yandex.ru
							</a>
						</div>
						<div className="mb-4 mb-lg-5 text-muted">
							Адрес магазина: <br className="d-lg-none" />
							<span className="text-primary">г.Краснодар, ул. Дзержинского, 87/1</span>
						</div>
						<div className="mb-4 mb-lg-5 text-muted">
							Режим работы: <br className="d-lg-none" />
							<span className="text-primary">каждый день с 10:00–20:00</span>
						</div>
					</div>
				</Col>
				<Col xs={12} lg={6}>
					<div className="bg-white p-4 py-5 p-lg-6 h-100">
						<div className="text-uppercase text-dark mb-5">Реквизиты</div>
						<div className="mb-4 mb-lg-5 text-muted">
							ИП: <span className="text-primary">ХИДИРАЛИЕВА ОЛЬГА ВИКТОРОВНА</span>
						</div>
						<div className="mb-4 mb-lg-5 text-muted">
							Расчётный счёт: <span className="text-primary">40802810730000031621</span>
						</div>
						<div className="mb-4 mb-lg-5 text-muted">
							ИНН: <span className="text-primary">234306326347</span>
						</div>
						<div className="mb-4 mb-lg-5 text-muted">
							ОГРН: <span className="text-primary">312237224100025</span>
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default ContactsPage