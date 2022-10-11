import { Col, Container, Row, Stack } from "react-bootstrap"
import { NavLink, useParams } from "react-router-dom"
import Banners from "./Banners"
import Item from "./Item"

const PigmentsPage = () => {
    const { id } = useParams()

    return (
		<Container fluid className="p-0">
			<Banners />
			<Container className="my-6">
				<Row>
					<Col xs={12} lg={9}>
						<Row xs={2} lg={3} className="g-4">
							<Col>
								<Item
									categoryId={id || ""}
									filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de95c575e91f834a882b90"]%7D]`}
									src={"/static/pigments/brows.jpg"}
									title="Брови"
									widthToHeight={263 / 168}
								/>
							</Col>
							<Col>
								<Item
									categoryId={id || ""}
									filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["629dfa701a7f483e3680e958"]%7D]`}
									src={"/static/pigments/arrows.jpg"}
									title="Веки"
									widthToHeight={263 / 168}
								/>
							</Col>
							<Col>
								<Item
									categoryId={id || ""}
									filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62a880014be6aed69690b5db"]%7D]`}
									src={"/static/pigments/lips.jpg"}
									title="Губы"
									widthToHeight={263 / 168}
								/>
							</Col>
							<Col>
								<Item
									categoryId={id || ""}
									filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de96bb75e91f834a882ca5"]%7D]`}
									src={"/static/pigments/tricho.jpg"}
									title="Трихопигментация"
									widthToHeight={263 / 168}
								/>
							</Col>
							<Col>
								<Item
									categoryId={id || ""}
									filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de96ce75e91f834a882cc1"]%7D]`}
									src={"/static/pigments/camo.jpg"}
									title="Камуфляж и ареолы"
									widthToHeight={263 / 168}
								/>
							</Col>
							<Col>
								<Item
									categoryId={id || ""}
									filters={`[%7B"filterId":"629dfa131a7f483e3680e933","valueIds":["62de96c475e91f834a882cb3"]%7D]`}
									src={"/static/pigments/correctors.jpg"}
									title="Корректоры"
									widthToHeight={263 / 168}
								/>
							</Col>
						</Row>
					</Col>
					<Col xs={12} lg={3} className="d-flex flex-column">
						<NavLink className="pigments-page__link p-4 mb-4" to="/coloristic">
							Бесплатная колористика
						</NavLink>
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
		</Container>
	)
}

export default PigmentsPage