import { Col, Container, Row, Stack } from "react-bootstrap"
import { NavLink, useParams } from "react-router-dom"
import Banners from "./Banners"
import Item from "./Item"

const PigmentsPage = () => {
    const { id } = useParams()

    return (
		<Container className="pb-6">
			<Banners />
			<Row>
				<Col xs={12} lg={9}>
					<Row xs={2} lg={3} className="g-4">
						<Col>
							<Item
								categoryId={id || ""}
								filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["629dfa701a7f483e3680e958"]%7D]`}
								src={"/static/pigments/brows.jpg"}
								title="Брови"
								widthToHeight={263 / 168}
							/>
						</Col>
						<Col>
							<Item categoryId={id || ""} filters={"[]"} src={"/static/pigments/arrows.jpg"} title="Веки" widthToHeight={263 / 168} />
						</Col>
						<Col>
							<Item categoryId={id || ""} filters={"[]"} src={"/static/pigments/lips.jpg"} title="Губы" widthToHeight={263 / 168} />
						</Col>
						<Col>
							<Item
								categoryId={id || ""}
								filters={"[]"}
								src={"/static/pigments/tricho.jpg"}
								title="Трихопигментация"
								widthToHeight={263 / 168}
							/>
						</Col>
						<Col>
							<Item
								categoryId={id || ""}
								filters={"[]"}
								src={"/static/pigments/camo.jpg"}
								title="Камуфляж и ареолы"
								widthToHeight={263 / 168}
							/>
						</Col>
						<Col>
							<Item
								categoryId={id || ""}
								filters={"[]"}
								src={"/static/pigments/correctors.jpg"}
								title="Корректоры"
								widthToHeight={263 / 168}
							/>
						</Col>
					</Row>
				</Col>
				<Col xs={12} lg={3} className="d-flex flex-column">
					<a href="https://drobot-online-academy.ru/drobot_pigments_koloristika" className="pigments-page__link p-4">
						бесплатная колористика
					</a>
					<NavLink className="pigments-page__link p-4 mb-4" to="/partner-program">
						Стать агентом
					</NavLink>
					<NavLink className="pigments-page__link p-4 mb-4" to="/partner-program">
						Стать представителем
					</NavLink>
					<NavLink className="pigments-page__link p-4" to="/partner-program">
						Стать тренером
					</NavLink>
				</Col>
			</Row>
		</Container>
	)
}

export default PigmentsPage