import { Col, Container, Image, Row } from "react-bootstrap"
import CartPage from "../cartPage/CartPage"
const sdekLogo = require('../../img/cdek.svg')
const postLogo = require("../../img/pochtaRF.svg")
const logo = require("../../img/logo-dark-text.png")

const DeliveryPage = () => {
    return (
		<Container className="pb-6">
			<h3>Доставка</h3>
			<Row className="g-5">
				<Col xs={12} lg={6} className="mb-6 mb-lg-0">
					<div className="p-4 p-lg-5 h-100" style={{ backgroundColor: "#F9F9F9" }}>
						<Image src={sdekLogo} alt="СДЭК" width="159" />
						<div className="text-uppercase mt-2 mb-4">Курьерская служба</div>
						<div className="text-muted mb-2">Способы доставки: </div>
						<ul className="mb-4 p-0 delivery-list">
							<li className="mb-1">В ближайщий для покупателя пункт выдачи СДЭК</li>
							<li>Доставка курьером до адреса покупателя</li>
						</ul>
						<div className="text-muted mb-2">Срок доставки: </div>
						<ul className="mb-4 p-0 delivery-list">
							<li>2–5 дней, в зависимости от направления</li>
						</ul>
						<div className="text-muted mb-2">Стоимость: </div>
						<ul className="p-0 delivery-list">
							<li>от 300 рублей, рассчитывается индивидуально</li>
						</ul>
					</div>
				</Col>
				<Col xs={12} lg={6}>
					<div className="p-4 p-lg-5 h-100" style={{ backgroundColor: "#F9F9F9" }}>
						<Image src={postLogo} alt="СДЭК" width="159" />
						<div className="text-uppercase mt-2 mb-4">Курьерская служба</div>
						<div className="text-muted mb-2">Способы доставки: </div>
						<ul className="mb-4 p-0 delivery-list">
							<li>В отделении Почты России</li>
						</ul>
						<div className="text-muted mb-2">Срок доставки: </div>
						<ul className="mb-4 p-0 delivery-list">
							<li>от 10-20 дней, в зависимости от направления</li>
						</ul>
						<div className="text-muted mb-2">Стоимость: </div>
						<ul className="p-0 delivery-list">
							<li>Бесплатно</li>
						</ul>
					</div>
				</Col>
				<Col xs={12}>
					<div className="p-4 p-lg-5 h-100" style={{ backgroundColor: "#F9F9F9" }}>
						<Row className="g-5">
							<Col xs={12} lg={4}>
								<img src={logo} alt="logo" width="130" />
								<div className="mt-3 text-uppercase">Магазин в г. Краснодар</div>
							</Col>
							<Col xs={12} lg={8}>
								<Row className="g-5">
									<Col xs={12} lg={6}>
										<div className="text-muted mb-2">Способы доставки:</div>
										<div className="d-flex">
											<div className="m-1 rounded-circle bg-dark" style={{ height: "5px", width: "7px" }}></div>
											<div>Самовывоз из нашего магазина по адресу: г. Краснодар, ул. Дзержинского 87/1</div>
										</div>
									</Col>
									<Col xs={12} lg={6}>
										<div className="text-muted mb-2">Когда можно забрать заказ?</div>
										<div>Ежедневно 10:00 – 20:00</div>
									</Col>
									<Col xs={12} className="d-none d-lg-block">
										<div className="text-muted">
											*Все цены на сайте соответствуют действительности, заказчик не несет никаких дополнительных расходов за
											вывоз товара!
										</div>
									</Col>
								</Row>
							</Col>
							<Col xs={12} className="d-lg-none">
								<div className="text-muted">
									*Все цены на сайте соответствуют действительности, заказчик не несет никаких дополнительных расходов за вывоз
									товара!
								</div>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default DeliveryPage