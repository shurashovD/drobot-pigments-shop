import { Col, Container, Image, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
const OD = require("../../img/Olga_Drobot.jpg")
const IMG = require('../../img/about_2.jpg')

const AboutPage = () => {
    return (
		<Container className="mb-6">
			<Row className="g-3 mb-6">
				<Col xs={12} lg={6} className="d-flex flex-column justify-content-center">
					<h3 className="mt-0 mb-2 text-center border-0">
						<span className="white-space text-color-bg">Приветствую вас </span>
						<span className="white-space text-color-bg">в магазине</span>{" "}
						<span className="white-space text-color-bg">DROBOT Pigments Shop</span>,
					</h3>
					<div className="text-center text-uppercase text-muted mb-4">в магазине для мастеров перманентного макияжа.</div>
					<p className="text-center">
						Я - Ольга Дробот, и я помогу вам разобраться в оборудовании и расходниках для ПМ. Так как я мастер ПМ с 2010 года, я знаю
						множество нюансов в подборе и комплектации оборудования.
					</p>
					<p className="text-center">
						А ещё я люблю, когда мастеру удобно в работе, и его ничего не отвлекает, особенно неправильно подобранное или скомплектованное
						оборудование - это важно. Поэтому я постоянно делаю акценты и упор на удобство!
					</p>
					<p className="text-center">
						Я уже выпустила удобную одежду для мастеров индустрии красоты - которая не мнётся и не сковывает движения во время работы.
						Разработала удобные пигменты для ПМ - с легкой и понятной колористикой, и легким подбором цвета, с которым справится даже
						новичок! И постоянно ставлю перед своей командой новые задачи по доработке инструментов для работы мастера до идеального
						удобства!
					</p>
				</Col>
				<Col xs={12} lg={6}>
					<div>
						<Image src={OD} alt="drobot-pigments-shop" fluid style={{ maxHeight: "80vh" }} />
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12} lg={5}>
					<div>
						<Image src={IMG} alt="drobot-pigments-shop" fluid style={{ maxHeight: "80vh" }} />
					</div>
				</Col>
				<Col xs={12} lg={7} className="d-flex flex-column">
					<h3 className="mt-0 mb-5 text-center border-0 p-0">
						<span className="white-space text-color-bg">DROBOT PIGMENTS SHOP </span>
						<span className="text-color-bg">является </span>
						<span className="white-space text-color-bg">лидирующим магазином </span>
						<span className="text-color-bg">для </span>
						<span className="white-space text-color-bg">перманентного макияжа </span>
						<span className="white-space text-color-bg">в России.</span>
					</h3>
					<p className="text-center">
						Мы выпускаем удобные шнуры для всех разновидностей аппаратов, удобные пинцеты, удобную хну, которая быстро красит и долго
						держится на коже, и многое другое.
						<br />
						А ещё мы проверяем каждый товар при получении и перед отправкой, чтобы гарантировать Вам идеальное качество продаваемой
						продукции!
						<br />
						Вся продукция всегда имеется в наличии!
					</p>
					<p className="text-center">
						Мы быстро обрабатываем ваши заявки и отправляем посылки максимум в течение 2-х дней, 98% посылок отправляются в день получения
						и оплаты заявки.
						<br />
						Так же вы можете приехать в магазин в Краснодаре и самостоятельно выбрать продукцию, убедится в её качестве и задать все
						интересующие вопросы.
					</p>
					<p className="text-center mb-5">
						Тысячи мастеров доверяют нам и сотрудничают с нами уже много лет, так как магазин существует с 2014 года.
					</p>
					<div className="text-center mt-auto">
						<NavLink to="/profile" className="btn btn-outline-dark text-primary">
							Присоединяйся!
						</NavLink>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default AboutPage