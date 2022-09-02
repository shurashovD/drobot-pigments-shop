import { FC, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import IconDiscount from "../../../components/icons/IconDiscount"
import DiscountComponent from "../main/DiscountComponent"

const Promo= () => {
	const navigate = useNavigate()
	const { hash } = useLocation()
	const eventKey = 'promo'
	const [stroke, setStroke] = useState("white")

	useEffect(() => {
		setStroke(hash === `#${eventKey}` ? "#39261F" : "white")
	}, [hash])

	return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header className="text-uppercase" onClick={() => navigate({ hash: hash === `#${eventKey}` ? "" : eventKey })}>
				<IconDiscount stroke={stroke} />
				<span className={`ms-2 text-uppercase ${hash !== `#${eventKey}` && "text-white"}`}>Персональная скидка</span>
			</Accordion.Header>
			<Accordion.Body>
				<DiscountComponent />
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default Promo