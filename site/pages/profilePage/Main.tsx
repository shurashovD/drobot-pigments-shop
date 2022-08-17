import { Col, Container, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import IconAccount from "../../components/icons/IconAccount"
import IconOrders from "../../components/icons/IconOrders"
import IconDelivery from "../../components/icons/IconDelivery"
import DeliveryComponent from "./components/DeliveryComponent"
import PrivateDataComponent from './components/PrivateDataComponent'
import IconDiscount from "../../components/icons/IconDiscount"
import DiscountComponent from "./components/DiscountComponent"

const Main = () => {
    return (
		<Container className="pt-5">
			<Row xs={1} lg={2} className="g-4">
				<Col>
					<div className="border border-secondary">
						<div className="bg-secondary p-3 px-4 border border-secondary border-2">
							<IconAccount stroke="#141515" />
							<span className="ms-2 text-uppercase">Личные данные</span>
						</div>
						<div className="py-4">
							<PrivateDataComponent />
						</div>
					</div>
				</Col>
				<Col>
					<div className="border border-secondary">
						<div className="bg-secondary p-3 px-4 border border-secondary border-2">
							<IconDelivery stroke="#141515" />
							<span className="ms-2 text-uppercase">Доставка</span>
						</div>
						<div className="py-4">
							<DeliveryComponent />
						</div>
					</div>
					<Row xs={1} xl={2} className="mt-4 g-4">
						<Col>
							<div className="border border-dark h-100">
								<div className="bg-dark p-3 px-4 border border-dark border-2">
									<IconOrders stroke="#ffffff" />
									<NavLink className="ms-2 text-uppercase text-white" to="/profile#orders">
										Заказы
									</NavLink>
								</div>
								<div className="py-4">
									<DeliveryComponent />
								</div>
							</div>
						</Col>
						<Col>
							<div className="border border-dark h-100">
								<div className="bg-dark p-3 px-4 border border-dark border-2">
									<IconDiscount stroke="#ffffff" />
									<span className="ms-2 text-uppercase text-white">Персональная скидка</span>
								</div>
								<div className="p-4">
									<DiscountComponent />
								</div>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	)
}

export default Main