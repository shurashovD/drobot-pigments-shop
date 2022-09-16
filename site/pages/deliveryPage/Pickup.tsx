import { Col, Row } from "react-bootstrap"
const logo = require("../../img/logo-dark-text.png")

const Pickup = () => {
	return (
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
								*Все цены на сайте соответствуют действительности, заказчик не несет никаких дополнительных расходов за вывоз товара!
							</div>
						</Col>
					</Row>
				</Col>
				<Col xs={12} className="d-lg-none">
					<div className="text-muted">
						*Все цены на сайте соответствуют действительности, заказчик не несет никаких дополнительных расходов за вывоз товара!
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default Pickup
