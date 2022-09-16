import { Accordion } from "react-bootstrap"
import Fird from "./descriptionContent/Fird"
import First from "./descriptionContent/First"
import Fivth from "./descriptionContent/Fivth"
import Fourth from "./descriptionContent/Fourth"
import Second from "./descriptionContent/Second"

const Descriprion = () => {
    return (
		<Accordion flush id="delivery-description-accordion">
			<Accordion.Item eventKey="1">
				<Accordion.Header>
					<div className="text-uppercase">“СВОЯ ДОСТАВКА” по Краснодару и Краснодарскому краю</div>
				</Accordion.Header>
				<Accordion.Body>
					<First />
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="2">
				<Accordion.Header className="text-uppercase">
					<div className="text-uppercase">ДОСТАВКА ПО РОССИИ</div>
				</Accordion.Header>
				<Accordion.Body>
					<Second />
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="3">
				<Accordion.Header className="text-uppercase">
					<div className="text-uppercase">Варианты доставки</div>
				</Accordion.Header>
				<Accordion.Body>
					<Fird />
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="4">
				<Accordion.Header className="text-uppercase">
					<div className="text-uppercase">ДОСТАВКА В СТРАНЫ СНГ И БЛИЖНЕГО ЗАРУБЕЖЬЯ</div>
				</Accordion.Header>
				<Accordion.Body>
					<Fourth />
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="5">
				<Accordion.Header className="text-uppercase">
					<div className="text-uppercase">Оплата</div>
				</Accordion.Header>
				<Accordion.Body>
					<Fivth />
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	)
}

export default Descriprion