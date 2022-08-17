import { Col, Container, Image, Row } from "react-bootstrap"
const sdekLogo = require('../../img/cdek.svg')
const postLogo = require("../../img/pochtaRF.svg")

const DeliveryPage = () => {
    return (
		<Container className="pb-6">
			<h3>Доставка</h3>
			<Row xs={1} lg={2}>
				<Col className="mb-6 mb-lg-0">
					<Image src={sdekLogo} alt="СДЭК" width="159" />
					<div className="text-uppercase mt-2 mb-4">
						Курьерская служба
					</div>
					<div className="text-muted mb-2">Способы доставки: </div>
					<ul className="mb-4 p-0 delivery-list">
						<li className="mb-1">
							В ближайщий для покупателя пункт выдачи СДЭК
						</li>
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
				</Col>
				<Col>
					<Image src={postLogo} alt="СДЭК" width="159" />
					<div className="text-uppercase mt-2 mb-4">
						Курьерская служба
					</div>
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
				</Col>
			</Row>
		</Container>
	)
}

export default DeliveryPage