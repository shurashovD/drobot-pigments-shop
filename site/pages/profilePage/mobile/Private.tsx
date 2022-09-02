import { useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import IconAccount from "../../../components/icons/IconAccount"
import PrivateDataComponent from "../main/PrivateDataComponent"

const Private = () => {
	const eventKey = "private"
	const { hash } = useLocation()
	const [stroke, setStroke] = useState("white")
	const navigate = useNavigate()

	useEffect(() => {
		setStroke(hash === `#${eventKey}` ? "#39261F" : "white")
	}, [hash])

    return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header className="text-uppercase" onClick={() => navigate({ hash: hash === `#${eventKey}` ? "" : eventKey })}>
				<IconAccount stroke={stroke} />
				<span className={`ms-2 text-uppercase ${hash !== `#${eventKey}` && "text-white"}`}>Личные данные</span>
			</Accordion.Header>
			<Accordion.Body className="px-0">{hash === `#${eventKey}` && <PrivateDataComponent />}</Accordion.Body>
		</Accordion.Item>
	)
}

export default Private