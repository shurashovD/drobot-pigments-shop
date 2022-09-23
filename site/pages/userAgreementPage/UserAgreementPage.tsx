import { Accordion, Container } from "react-bootstrap"
import Eighth from "./Eighth"
import Fird from "./Fird"
import First from "./First"
import Fivth from "./Fivth"
import Fourth from "./Fourth"
import Ninth from "./Ninth"
import Seventh from "./Seventh"

const UserAgreementPage = () => {
    return (
		<Container>
			<h3>Пользовательское соглашение</h3>
			<Accordion className="custom-accordion mb-6" flush defaultActiveKey="1">
				<Accordion.Item eventKey="1">
					<Accordion.Header className="text-uppercase">1. Общие положения</Accordion.Header>
					<Accordion.Body>
						<First />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2">
					<Accordion.Header className="text-uppercase">2. ПРЕДМЕТ ДОГОВОРА</Accordion.Header>
					<Accordion.Body>
						<p className="mb-5">
							2.1. Продавец обязуется продать, а Покупатель обязуется принять и оплатить Товар по ценам, указанным в описании Товара на
							соответствующей странице Сайта на условиях настоящей Оферты, действующая редакция которой размещена на Сайте.
						</p>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="3">
					<Accordion.Header className="text-uppercase">3. ОФОРМЛЕНИЕ ЗАКАЗА</Accordion.Header>
					<Accordion.Body>
						<Fird />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="4">
					<Accordion.Header className="text-uppercase">4. ОПЛАТА ЗАКАЗА</Accordion.Header>
					<Accordion.Body>
						<Fourth />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="5">
					<Accordion.Header className="text-uppercase">
						5. ПОЛУЧЕНИЕ ТОВАРА. ДОСТАВКА ТОВАРА ПОКУПАТЕЛЮ. ВОЗВРАТ ИЛИ ОТКАЗ ОТ ЗАКАЗАННОГО (ДОСТАВЛЕННОГО) ТОВАРА
					</Accordion.Header>
					<Accordion.Body>
						<Fivth />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="6">
					<Accordion.Header className="text-uppercase">6. АВТОРСКИЕ ПРАВА</Accordion.Header>
					<Accordion.Body>
						<p className="mb-5">
							6.1. Вся текстовая информация и графические изображения, размещенные на Сайте Продавца, являются собственностью Продавца
							и/или его поставщиков и производителей Товара.
						</p>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="7">
					<Accordion.Header className="text-uppercase">7. ОТВЕТСТВЕННОСТЬ ПРОДАВЦА</Accordion.Header>
					<Accordion.Body>
                        <Seventh />
                    </Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="8">
					<Accordion.Header className="text-uppercase">8. ПРЕТЕНЗИИ ПОКУПАТЕЛЯ</Accordion.Header>
					<Accordion.Body>
                        <Eighth />
                    </Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="9">
					<Accordion.Header className="text-uppercase">9. РЕКВИЗИТЫ ПРОДАВЦА</Accordion.Header>
					<Accordion.Body>
                        <Ninth />
                    </Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</Container>
	)
}

export default UserAgreementPage