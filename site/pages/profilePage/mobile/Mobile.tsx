import { Accordion, Container } from "react-bootstrap"
import Delivery from "./Delivery"
import Private from "./Private"
import { useEffect, useState } from "react"
import PromoOrders from "./PromoOrders"
import Promo from "./Promo"
import CashBack from "./CashBack"
import ProfileEditComponent from "./ProfileEditComponent"
import { useLocation, useNavigate } from "react-router-dom"
import Orders from "../orders/Orders"
import OrdersAccordionComponent from "./Orders"
import { useAccountAuthQuery, useLogoutMutation } from "../../../application/account.service"
import PromocodesMobile from "./PromocodesMobile"
import ButtonComponent from "../../../components/ButtonComponent"

const Mobile = () => {
	const { hash } = useLocation()
    const [activeKey, setActiveKey] = useState<string | undefined>()
	const { data } = useAccountAuthQuery(undefined)
	const [logout, { isLoading, isSuccess }] = useLogoutMutation()
	const navigate = useNavigate()
	
	useEffect(() => {
		if ( isSuccess ) {
			navigate('/')
		}
	}, [isSuccess, navigate])

	useEffect(() => {
		if (hash === "#promocodes" || hash === "#cashback" || hash === "#orders")
			window.scrollTo({
				behavior: "smooth",
				left: 0,
				top: 20,
			})
	}, [hash])

    return (
		<Container fluid className="px-0 m-0">
			{hash === "#profile" && <ProfileEditComponent />}
			{hash === "#orders" && <Orders />}
			{(hash === "#promocodes" || hash === "#cashback") && <PromocodesMobile />}
			{hash !== "#profile" && hash !== "#orders" && hash !== "#promocodes" && hash !== "#cashback" && (
				<div>
					<Accordion className="profile-mobile-accordion" activeKey={hash.substring(1)}>
						<Private />
						<Delivery />
						<OrdersAccordionComponent />
						<Promo />
						{data && (data?.status === "agent" || data?.status === "delegate") && (
							<PromoOrders onClick={(key?: string) => setActiveKey(key)} activeKey={activeKey} />
						)}
						{data && (data?.status === "agent" || data?.status === "delegate") && (
							<CashBack onClick={(key?: string) => setActiveKey(key)} activeKey={activeKey} />
						)}
					</Accordion>
					<hr className="opacity-25 my-4" />
					<ButtonComponent onClick={() => logout()} isLoading={isLoading} disabled={!data} variant="link" className="text-muted">
						Выйти
					</ButtonComponent>
				</div>
			)}
		</Container>
	)
}

export default Mobile