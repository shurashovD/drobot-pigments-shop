import { useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import BannerComponent from "../../components/BannerComponent"
import Descriprion from "./Descriprion"
import Pickup from "./Pickup"
import PostRF from "./PostRF"
import Sdek from "./Sdek"

const DeliveryPage = () => {
	useEffect(() => {
		document.title = 'Доставка и оплата'
	}, [])

    return (
		<Container className="p-0" fluid>
			<BannerComponent folder="deliveryPage" mobileWidthToHeight={414 / 550} widthToHeight={1440 / 450} />
			<Container className="mt-5 pb-6">
				<Row className="g-5">
					<Col xs={12} lg={6} className="mb-6 mb-lg-0">
						<Sdek />
					</Col>
					<Col xs={12} lg={6}>
						<PostRF />
					</Col>
					<Col xs={12}>
						<Pickup />
					</Col>
				</Row>
				<Descriprion />
			</Container>
		</Container>
	)
}

export default DeliveryPage