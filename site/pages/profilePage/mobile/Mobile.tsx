import { Accordion, Container } from "react-bootstrap"
import Delivery from "./Delivery"
import Private from "./Private"
import { useState } from "react"
import PromoOrders from "./PromoOrders"
import Promo from "./Promo"
import CashBack from "./CashBack"
import ProfileEditComponent from "./ProfileEditComponent"
import { useLocation } from "react-router-dom"
import Orders from "../Orders"
import OrdersAccordionComponent from "./Orders"
import { useAccountAuthQuery } from "../../../application/account.service"

const Mobile = () => {
	const { hash } = useLocation()
    const [activeKey, setActiveKey] = useState<string | undefined>()
	const { data } = useAccountAuthQuery(undefined)

    return (
		<Container fluid className="px-0 m-0">
			{hash === "#profile" && <ProfileEditComponent />}
			{hash === "#orders" && <Orders />}
			{hash !== "#profile" && hash !== "#orders" && (
				<Accordion className="profile-mobile-accordion" activeKey={hash.substring(1)}>
					<Private />
					<Delivery />
					<OrdersAccordionComponent />
					<Promo />
					{data && (data?.status === 'agent' || data?.status === 'delegate') && (
						<PromoOrders onClick={(key?: string) => setActiveKey(key)} activeKey={activeKey} />
					)}
					{data && (data?.status === 'agent' || data?.status === 'delegate') && (
						<CashBack onClick={(key?: string) => setActiveKey(key)} activeKey={activeKey} />
					)}
				</Accordion>
			)}
		</Container>
	)
}

export default Mobile