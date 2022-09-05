import { FC, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import IconCashback from "../../../components/icons/IconCashback"

interface IProps {
	activeKey?: string
	onClick: (key?: string) => void
}

const CashBack: FC<IProps> = ({ activeKey, onClick }) => {
	const eventKey = 'cashBack'
	const [stroke, setStroke] = useState("white")

	useEffect(() => {
		setStroke(activeKey === eventKey ? "#39261F" : "white")
	}, [activeKey])

	return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header className="text-uppercase" onClick={() => onClick(activeKey === eventKey ? undefined : eventKey)}>
				<IconCashback stroke="#ffffff" />
				<NavLink to="/profile#cashback">
					<span className="ms-2 text-uppercase text-white">Кэшбэк</span>
				</NavLink>
			</Accordion.Header>
			<Accordion.Body></Accordion.Body>
		</Accordion.Item>
	)
}

export default CashBack