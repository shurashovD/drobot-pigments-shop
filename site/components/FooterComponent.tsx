import { Col, Container, Image, Row, Stack } from "react-bootstrap"
import { NavLink } from "react-router-dom"
const vkLogo = require('../img/vk.svg')
const instaLogo = require("../img/insta.svg")
const tgLogo = require("../img/telegram.svg")
const youtubeLogo = require("../img/youtube.svg")

const FooterComponent = () => {
    return (
		<Container fluid className="bg-primary pt-5 pb-6 pb-md-4" id="footer-component">
			<Container className="pb-1">
				<Row xs={1} md={3} className="mb-6">
					<Col className="mb-6 mb-md-0">
						<Row>
							<Col xs={"auto"} className="mb-3">
								<span className="text-white">Присоединяйся:</span>
							</Col>
							<Col xs={"auto"}>
								<Stack direction="horizontal" className="mx-auto" gap={4}>
									<div>
										<a href="https://vk.com/drobot_pigments" target="_blank" rel="noopener noreferrer">
											<Image src={vkLogo} />
										</a>
									</div>
									<div>
										<a href="http://instagram.com/drobot_pigments" target="_blank" rel="noopener noreferrer">
											<Image src={instaLogo} />
										</a>
									</div>
									<div>
										<a href="http://t.me/drobot_pigments" target="_blank" rel="noopener noreferrer">
											<Image src={tgLogo} />
										</a>
									</div>
									<div>
										<a href="https://www.youtube.com/channel/UCZv-qFu8fT3BU5WvjNbJnYA" target="_blank" rel="noopener noreferrer">
											<Image src={youtubeLogo} />
										</a>
									</div>
								</Stack>
							</Col>
						</Row>
					</Col>
					<Col className="mb-5 mb-md-0">
						<Stack gap={2}>
							<div className="mb-3 text-center text-md-start">
								<span className="text-uppercase text-secondary">Покупателю</span>
							</div>
							<div className="text-center text-md-start d-none">
								<NavLink to="/" className="footer__link">
									Статус заказа
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink to="/delivery" className="footer__link">
									Доставка и оплата
								</NavLink>
							</div>
							<div className="text-center text-md-start d-none">
								<NavLink to="/" className="footer__link">
									Бонусная программа
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink to="/contacts" className="footer__link">
									Контакты
								</NavLink>
							</div>
						</Stack>
					</Col>
					<Col>
						<Stack gap={2}>
							<div className="mb-3 text-center text-md-start">
								<span className="text-uppercase text-secondary">Сотрудничество</span>
							</div>
							<div className="text-center text-md-start">
								<NavLink to="/partner-program" className="footer__link">
									Стать представителем?
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink to="/partner-program" className="footer__link">
									Стать агентом?
								</NavLink>
							</div>
							<div className="text-center text-md-start d-none">
								<NavLink to="/" className="footer__link">
									Как стать амбассадором?
								</NavLink>
							</div>
						</Stack>
					</Col>
				</Row>
				<Row xs={1} md={"auto"} className="justify-content-center mb-5 gap-4 d-none">
					<Col className="text-center text-md-start">
						<NavLink to="/" className="footer-light__link">
							Политика конфиденциальности
						</NavLink>
					</Col>
					<Col className="text-center text-md-start">
						<NavLink to="/" className="footer-light__link">
							Пользовательское соглашение
						</NavLink>
					</Col>
					<Col className="text-center text-md-start">
						<NavLink to="/" className="footer-light__link">
							Cookie
						</NavLink>
					</Col>
				</Row>
				<Row xs={1} md={3}>
					<Col className="offset-md-4 text-center text-white">
						<p className="m-0">2022 ©Drobot Pigments</p>
						<p className="m-0">Все права защищены.</p>
					</Col>
					<Col className="d-flex justify-content-center justify-content-md-start mt-4 mt-md-0">
						<a href="https://www.behance.net/natali_shurashova" className="footer-light__link mt-auto">
							Разработка сайта: PAZZL
						</a>
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default FooterComponent