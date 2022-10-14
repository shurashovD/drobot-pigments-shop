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
							title="Курс “Дробот про эскиз”"
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
						<Item folder="lazer" title='Курс "Лазерное удаление"' url="https://drobot-online-academy.ru/lu" widthToHeight={263 / 168} />
					</Col>
					<Col>
						<Item folder="monaliza" title='Курс "MonaLiza 7"' url="https://drobot-online-academy.ru/lazer" widthToHeight={263 / 168} />
					</Col>
					<Col>
						<Item
							folder="magicRemover"
							title='Курс "Ремувер MAGIC"'
							url="https://drobot-online-academy.ru/magic_cource"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="mezhresnichka"
							title='Курс "межресничная зона"'
							url="https://drobot-online-academy.ru/mezhresnichka"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item
							folder="feathering"
							title='Курс "теневая растушевка"'
							url="https://drobot-online-academy.ru/tenevaya_rastushevka"
							widthToHeight={263 / 168}
						/>
					</Col>
					<Col>
						<Item folder="sanpin" title='Курс "СанПиН"' url="https://drobot-online-academy.ru/sanpin_for_pm" widthToHeight={263 / 168} />
					</Col>
					<Col>
						<Item
							folder="tatoo"
							title='Курс "Мини тату"'
							url="https://drobot-online-academy.ru/minitattoo_for_pmu_masters"
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