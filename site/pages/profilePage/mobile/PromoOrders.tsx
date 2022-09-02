import { FC, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import IconPromocode from "../../../components/icons/IconPromocode"

interface IProps {
	activeKey?: string
	onClick: (key?: string) => void
}

const PromoOrders: FC<IProps> = ({ activeKey, onClick }) => {
	const eventKey = 'promoOrders'
	const [stroke, setStroke] = useState("white")

	useEffect(() => {
		setStroke(activeKey === eventKey ? "#39261F" : "white")
	}, [activeKey])

	return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header className="text-uppercase" onClick={() => onClick(activeKey === eventKey ? undefined : eventKey)}>
				<IconPromocode stroke={stroke} />
				<NavLink to="/profile#promocodes">
					<span className={`ms-2 text-uppercase ${activeKey !== eventKey && "text-white"}`}>Заказы по промокодам</span>
				</NavLink>
			</Accordion.Header>
			<Accordion.Body></Accordion.Body>
		</Accordion.Item>
	)
}

export default PromoOrders