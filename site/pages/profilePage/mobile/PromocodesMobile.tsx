import { useEffect, useState } from "react"
import { Button, Col, Container, Row, Tab } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import IconCashback from "../../../components/icons/IconCashback"
import IconPromocode from "../../../components/icons/IconPromocode"
import Promocodes from "../promocodes/Promocodes"
import CashbackComponent from "../main/CashbackComponent"

const PromocodesMobile = () => {
    const [activeKey, setActiveKey] = useState("1")
    const { hash } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if ( hash === '#promocodes' ) {
            setActiveKey("1")
        }
        if (hash === "#cashback") {
			setActiveKey("2")
		}
    }, [hash])

    return (
		<Container fluid className="m-0 p-0">
			<Tab.Container activeKey={activeKey}>
				<Row className="w-100 m-0 p-0">
					<Col xs={6} className="d-flex justify-content-center align-items-center">
						<div className="text-center">
							<IconPromocode stroke={activeKey === "1" ? "#B88E5B" : "#141515"} />
						</div>
						<NavLink to="/profile#promocodes" className={`text-${activeKey === "1" ? "dark" : "primary"}`}>
							Промокоды
						</NavLink>
					</Col>
					<Col xs={6} className="d-flex justify-content-center align-items-center">
						<div className="text-center">
							<IconCashback stroke={activeKey === "2" ? "#B88E5B" : "#141515"} />
						</div>
						<NavLink to="/profile#cashback" className={`text-${activeKey === "2" ? "dark" : "primary"}`}>
							Кэшбэк
						</NavLink>
					</Col>
				</Row>
				<Button className="my-3 text-muted" variant="link" onClick={() => navigate("/profile#main")}>
					&larr; назад
				</Button>
				<Tab.Content>
					<Tab.Pane eventKey="1">
						<Promocodes />
					</Tab.Pane>
					<Tab.Pane eventKey="2">
                        <CashbackComponent />
                    </Tab.Pane>
				</Tab.Content>
			</Tab.Container>
		</Container>
	)
}

export default PromocodesMobile