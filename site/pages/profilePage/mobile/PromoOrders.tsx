import { FC } from "react"
import { Accordion } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import IconPromocode from "../../../components/icons/IconPromocode"

interface IProps {
	activeKey?: string
	onClick: (key?: string) => void
}

const PromoOrders: FC<IProps> = ({ activeKey, onClick }) => {
	const eventKey = 'promoOrders'
	const navigate = useNavigate()

	const handler = () => {
		onClick(activeKey === eventKey ? undefined : eventKey)
		navigate("/profile#promocodes")
	}

	return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header className="text-uppercase" onClick={handler}>
				<IconPromocode stroke="white" width="35" height="32" />
				<span className="ms-2 text-uppercase text-white">Промокоды</span>
			</Accordion.Header>
			<Accordion.Body></Accordion.Body>
		</Accordion.Item>
	)
}

export default PromoOrders