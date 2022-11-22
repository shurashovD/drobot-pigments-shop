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
					<Col className="mb-6 mb-md-0 w-max-content mx-auto">
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
						<Stack gap={2} className="mx-auto w-max-content">
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
							<div className="text-center text-md-start">
								<NavLink to="/garantees" className="footer__link">
									Гарантии и возврат
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
						<Stack gap={2} className="w-max-content mx-auto">
							<div className="mb-3 text-center text-md-start">
								<span className="text-uppercase text-secondary">Пигменты для ПМ</span>
							</div>
							<div className="text-center text-md-start">
								<NavLink
									to={`/category/629c8aacfc0259cf858d217b/[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de95c575e91f834a882b90"]%7D]`}
									className="footer__link"
								>
									Брови
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink
									to={`/category/629c8aacfc0259cf858d217b/[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["629dfa701a7f483e3680e958"]%7D]`}
									className="footer__link"
								>
									Веки
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink
									to={`/category/629c8aacfc0259cf858d217b/[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62a880014be6aed69690b5db"]%7D]`}
									className="footer__link"
								>
									Губы
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink
									to={`/category/629c8aacfc0259cf858d217b/[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de96bb75e91f834a882ca5"]%7D]`}
									className="footer__link"
								>
									Трихопигментация
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink
									to={`/category/629c8aacfc0259cf858d217b/[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de96ce75e91f834a882cc1"]%7D]`}
									className="footer__link"
								>
									Камуфляж и ареолы
								</NavLink>
							</div>
							<div className="text-center text-md-start">
								<NavLink
									to={`/category/629c8aacfc0259cf858d217b/[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de96c475e91f834a882cb3"]%7D]`}
									className="footer__link"
								>
									Корректоры
								</NavLink>
							</div>
						</Stack>
					</Col>
				</Row>
				<Row xs={1} md={3} className="justify-content-center mb-5">
					<Col className="text-center text-md-end">
						<NavLink to="/privacy-policy" className="footer-light__link">
							Политика конфиденциальности
						</NavLink>
					</Col>
					<Col className="text-center">
						<NavLink to="/user-agreement" className="footer-light__link">
							Пользовательское соглашение
						</NavLink>
					</Col>
					<Col className="text-center text-md-start">
						<NavLink to="/cookies" className="footer-light__link">
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