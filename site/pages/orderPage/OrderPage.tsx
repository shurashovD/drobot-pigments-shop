import { useEffect, useState } from "react"
import { Accordion, Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useGetCartQuery, useGetDeliveryCityQuery, useGetDeliveryDetailQuery, useGetRecipientQuery } from "../../application/order.service"
import CreateOrderBtn from "./CreateOrderBtn"
import DeliveryWrapper from "./DeliveryWrapper"
import ProductsWrapper from "./ProductsWrapper"
import RecipientWrapper from "./RecipientWrapper"
import RegionWrapper from "./RegionWrapper"

const OrderPage = () => {
    const navigate = useNavigate()
	const [activeKey, setActiveKey] = useState<string | undefined>()
	const {
		data: deliveryCity, isLoading: deliveryCityLoading, isFetching: deliveryCityFetching
	} = useGetDeliveryCityQuery(undefined, { refetchOnMountOrArgChange: true })
	const {
		data: deliveryDetail, isLoading: deliveryDetailLoading, isFetching: deliveryDetailFetching
	} = useGetDeliveryDetailQuery(undefined, { refetchOnMountOrArgChange: true })
	const {
		data: recipient,
		isLoading: recipientLoading,
		isFetching: recipientFetching,
	} = useGetRecipientQuery(undefined, { refetchOnMountOrArgChange: true })
	const {
		data: cart,
		isLoading: cartLoading,
		isFetching: cartFetching,
	} = useGetCartQuery(undefined, { refetchOnMountOrArgChange: true })

	const accordionHandler = (key: string) => {
		setActiveKey(key === activeKey ? undefined : key)
	}

	useEffect(() => {
		if (!deliveryCity) {
			setActiveKey("1")
			return
		}
		if (!deliveryDetail?.address) {
			setActiveKey("2")
			return
		}
		if (!(recipient?.name && recipient?.mail && recipient.phone)) {
			setActiveKey("3")
			return
		}
		setActiveKey('4')
	}, [
		deliveryCity, deliveryCityLoading, deliveryCityFetching,
		deliveryDetail, deliveryDetailLoading, deliveryDetailFetching,
		recipient, recipientLoading, recipientFetching,
		cart, cartLoading, cartFetching
	])

	useEffect(() => {
		if (deliveryDetail?.address) {
			setActiveKey("3")
		}
	}, [deliveryDetail])

	useEffect(() => {
		if (recipient?.name && recipient?.mail && recipient.phone) {
			setActiveKey("4")
		}
	}, [recipient])

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