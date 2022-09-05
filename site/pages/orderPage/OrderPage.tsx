import { useEffect, useState } from "react"
import { Accordion, Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import CreateOrderBtn from "./CreateOrderBtn"
import DeliveryWrapper from "./delivery/DeliveryWrapper"
import ProductsWrapper from "./products/ProductsWrapper"
import RecipientWrapper from "./recipient/RecipientWrapper"
import RegionWrapper from "./region/RegionWrapper"

const OrderPage = () => {
	const idMap = new Map([
		["1", "order-region"],
		["2", "order-delivery"],
		["3", "order-recipient"],
		["4", "order-products"],
	])
    const navigate = useNavigate()
	const [activeKey, setActiveKey] = useState<string | undefined>("1")

	const accordionHandler = (key: string) => {
		setActiveKey(key === activeKey ? undefined : key)
	}

	useEffect(() => {
		if ( !activeKey ) return
		const id = idMap.get(activeKey)
		if ( !id ) return
		const element = document.getElementById(id)
		if ( element ) {
			const shiftTop = id === 'order-region' ? 250 : 70
			setTimeout(() => {
				window.scrollTo(0, element.offsetTop - shiftTop)
			}, 500)
		}
	}, [activeKey])

    return (
		<Container className="pb-6">
			<Button variant="link" className="text-muted pb-4 pb-lg-6" onClick={() => navigate(-1)}>
				<span>&larr; назад</span>
			</Button>
			<h3>Оформление заказа</h3>
			<Row>
				<Col xs={12} lg={8}>
					<Accordion className="sign-order-accordion" activeKey={activeKey}>
						<RegionWrapper accordionHandler={accordionHandler} activeKey={activeKey} />
						<DeliveryWrapper accordionHandler={accordionHandler} activeKey={activeKey} />
						<RecipientWrapper accordionHandler={accordionHandler} activeKey={activeKey} />
						<ProductsWrapper accordionHandler={accordionHandler} activeKey={activeKey} />
					</Accordion>
				</Col>
				<Col xs={12} lg={4}></Col>
			</Row>
			<CreateOrderBtn />
		</Container>
	)
}

export default OrderPage