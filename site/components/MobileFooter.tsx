import { Col, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAccountAuthQuery } from "../application/account.service"
import CartIconComponent from "./CartIconComponent"
import ChatIconComponent from "./ChatIconComponent"
import CompIconComponent from "./CompIconComponent"
import FavIconComponent from "./FavIconComponent"
import IconAccount from "./icons/IconAccount"
import IconAccountSign from "./icons/IconAccountSign"
import IconHome from "./icons/IconHome"

const MobileFooter = () => {
	const { data } = useAccountAuthQuery(undefined)

    return (
		<Row style={{ zIndex: 10 }} className="d-lg-none bg-primary p-3 position-fixed bottom-0 start-0 end-0">
			<Col xs={2} className="d-flex justify-content-center align-items-center">
				<NavLink to="/" className="text-center">
					<IconHome stroke="#ffffff" />
				</NavLink>
			</Col>
			<Col xs={2} className="d-flex justify-content-center align-items-center">
				<CompIconComponent />
			</Col>
			<Col xs={2} className="d-flex justify-content-center align-items-center">
				<CartIconComponent />
			</Col>
			<Col xs={2} className="d-flex justify-content-center align-items-center">
				<FavIconComponent />
			</Col>
			<Col xs={2} className="d-flex justify-content-center align-items-center">
				<ChatIconComponent />
			</Col>
			<Col xs={2} className="d-flex justify-content-center align-items-center">
				<NavLink to="/profile">{!!data ? <IconAccountSign stroke={"#ffffff"} /> : <IconAccount stroke={"#ffffff"} />}</NavLink>
			</Col>
		</Row>
	)
}

export default MobileFooter