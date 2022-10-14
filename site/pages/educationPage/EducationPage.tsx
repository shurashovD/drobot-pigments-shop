import { useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import BannerComponent from "../../components/BannerComponent"
import Item from "./Item"

const EducationPage = () => {
	useEffect(() => {
		document.title = 'Обучение'
	}, [])

    return (
		<Container className="p-0" fluid>
			<BannerComponent folder="educationPage" mobileWidthToHeight={414 / 750} widthToHeight={1440 / 450} />
			<Container className="pb-6">
				<div className="d-flex justify-content-center">
					<h3>Обучение</h3>
				</div>
				<Row xs={2} lg={3} className="g-4">
					<Col>
						<Item
							folder="coach"
							title="Тренер Drobot pigments"
							url="https://drobot-online-academy.ru/trener_drobot_pigments"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="baseAfterBase"
							title="курс “База после базы”"
							url="https://drobot-online-academy.ru/bpb_predzayavki"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="overlap"
							title="курс “Перекрытие”"
							url="https://drobot-online-academy.ru/coverup_cource"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="sketch"
							title="Курс “про эскиз”"
							url="https://drobot-online-academy.ru/drobot_pro_eskiz"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="brows"
							title="Курс “роскошь бровей”"
							url="https://drobot-online-academy.ru/roskosh_brovey"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="freeEdu"
							title="Бесплатное обучение"
							url="https://drobot-online-academy.ru/drobot_pigments_koloristika"
							widthToHeight={263 / 168}
						/>
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default EducationPage