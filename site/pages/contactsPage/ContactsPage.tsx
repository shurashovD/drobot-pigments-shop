import { useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import BannerComponent from "../../components/BannerComponent"

const ContactsPage = () => {
	useEffect(() => {
		document.title = 'Контакты'
	}, [])

    return (
		<Container className="p-0" fluid>
			<BannerComponent folder="contanctsPage" mobileWidthToHeight={414 / 550} widthToHeight={1440 / 450} />
			<Container className="mt-5 pb-6">
				<Row className="g-5">
					<Col xs={12} lg={6}>
						<div className="bg-white p-4 py-5 p-lg-6 h-100">
							<div className="text-uppercase text-dark mb-5">Контакты</div>
							<div className="mb-4 mb-lg-5 text-muted">
								Служба поддержки клиентов: <br className="d-lg-none" />
								<a href="tel:+79189787010" className="text-primary">
									+7(918)978-70-10
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
		</Container>
	)
}

export default ContactsPage