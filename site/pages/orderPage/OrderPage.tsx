import { useEffect } from "react"
import { Accordion, Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from '../../application/hooks'
import { setActive } from "../../application/orderSlice"
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
	const { active: activeKey } = useAppSelector(state => state.orderSlice)
	const dispatch = useAppDispatch()

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

	useEffect(() => {
		dispatch(setActive("1"))
	}, [dispatch, setActive])

	useEffect(() => {
		document.title = 'Оформление заказа'
	}, [])

	return (
		<Container className="pb-6">
			<Button variant="link" className="text-muted pb-4 pb-lg-6" onClick={() => navigate(-1)}>
				<span>&larr; назад</span>
			</Button>
			<h3>Оформление заказа</h3>
			<Row>
				<Col xs={12} lg={8}>
					<Accordion className="sign-order-accordion" activeKey={activeKey}>
						<RegionWrapper />
						<DeliveryWrapper />
						<RecipientWrapper />
						<ProductsWrapper />
					</Accordion>
				</Col>
				<Col xs={12} lg={4}></Col>
			</Row>
			<CreateOrderBtn />
		</Container>
	)
}

export default OrderPage