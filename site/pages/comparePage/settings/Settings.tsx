import { Button, Col, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import IconCross from "../../../components/icons/IconCross"
import IconDelete from "../../../components/icons/IconDelete"
import RadioComponent from "../../../components/RadioComponent"

const Settings = () => {
    return (
		<div className="d-flex flex-column justify-content-center">
			<Row className="mb-4 g-0">
				<Col xs={2} className="d-flex justify-content-center align-items-center">
					<RadioComponent />
				</Col>
				<Col xs={10} className="d-flex align-items-center">
					<Button className="p-0 hover-dark text-start" variant="link">
						Все характеристики
					</Button>
				</Col>
			</Row>
			<Row className="mb-4 g-0">
				<Col xs={2} className="d-flex justify-content-center align-items-center">
					<RadioComponent />
				</Col>
				<Col xs={10} className="d-flex align-items-center">
					<Button className="p-0 hover-dark text-start" variant="link">
						Только различия
					</Button>
				</Col>
			</Row>
			<Row className="mb-4 g-0">
				<Col xs={2} className="d-flex justify-content-center align-items-center">
					<IconCross stroke="#AB9090" />
				</Col>
				<Col xs={10} className="d-flex align-items-center">
					<NavLink to="/">
						Добавить товары
					</NavLink>
				</Col>
			</Row>
			<Row className="mb-4 g-0">
				<Col xs={2} className="d-flex justify-content-center align-items-center">
					<IconDelete stroke="#AB9090" width={18} />
				</Col>
				<Col xs={10} className="d-flex align-items-center">
					<Button className="p-0 text-muted hover-primary text-start" variant="link">
						Очитстить список
					</Button>
				</Col>
			</Row>
		</div>
	)
}

export default Settings