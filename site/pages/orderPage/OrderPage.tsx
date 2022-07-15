import { useEffect, useState } from "react"
import { Accordion, Button, Col, Container, Fade, ListGroup, Row, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../application/hooks"
import { useCreateOrderMutation, useGetCartQuery, useGetDeliveryCityQuery, useGetDeliveryDetailQuery, useGetRecipientQuery } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
import Delivery from "./Delivery"
import FinalModal from "./FinalModal"
import OrderItem from "./OrderItem"
import Recipient from "./Recipient"
import Region from "./Region"

const parsePhoneValue = (value: string) => {
	const code = value.substring(0, 3)
	const first = value.substring(3, 6)
	const second = value.substring(6, 8)
	const fird = value.substring(8, 10)
	let result = "+7 ("
	if (value.length > 0) {
		result += code
	}
	if (value.length >= 3) {
		result += `) ${first}`
	}
	if (value.length >= 6) {
		result += `-${second}`
	}
	if (value.length >= 8) {
		result += `-${fird}`
	}
	return result
}

const OrderPage = () => {
    const navigate = useNavigate()
	const { products, variants } = useAppSelector(state => ({
		products: state.cartSlice.products.filter(({ checked }) => checked),
		variants: state.cartSlice.variants.filter(({ checked }) => checked)
	}))
	const [showModal, setShowModal] = useState(false)
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
		refetch,
		isLoading: cartLoading,
		isFetching: cartFetching,
	} = useGetCartQuery(undefined, { refetchOnMountOrArgChange: true })
	const [createOrder, { isLoading, data: orderInfo, isSuccess }] = useCreateOrderMutation()

	const accordionHandler = (event: any) => {
		const key = event.target.closest("h2").dataset?.key
		if ( key ) {
			setActiveKey(key === activeKey ? undefined : key)
		}
	}

	const hideHandler = () => {
		refetch()
		setShowModal(false)
		navigate('/')
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

	useEffect(() => {
		if ( isSuccess && orderInfo ) {
			setShowModal(true)
		}
	}, [isSuccess, orderInfo])

    return (
		<Container className="pb-6">
			<FinalModal
				number={orderInfo?.orderNumber}
				show={showModal}
				onHide={hideHandler}
				url={orderInfo?.url}
			/>
			<Button
				variant="link"
				className="text-muted pb-4 pb-lg-6"
				onClick={() => navigate(-1)}
			>
				<span>&larr; назад</span>
			</Button>
			<h3>Оформление заказа</h3>
			<Fade
				in={
					!(
						deliveryCityFetching &&
						deliveryDetailLoading &&
						recipientLoading &&
						cartLoading
					)
				}
			>
				<Row>
					<Col xs={12} lg={8}>
						<Accordion
							className="sign-order-accordion"
							activeKey={activeKey}
						>
							<Accordion.Item
								eventKey="1"
								className="border-0 border-bottom"
							>
								<Accordion.Header
									onClick={accordionHandler}
									data-key={1}
								>
									<span className="text-uppercse fs-3">
										1. Регион доставки
									</span>
								</Accordion.Header>
								<Accordion.Body>
									<Region />
								</Accordion.Body>
							</Accordion.Item>
							<Fade in={!!deliveryCity && activeKey !== "1"}>
								<div className="my-5">
									<span>Город доставки: </span>
									<b>{deliveryCity}</b>
								</div>
							</Fade>
							<Accordion.Item
								eventKey="2"
								className="border-0 border-bottom"
							>
								<Accordion.Header
									onClick={accordionHandler}
									data-key={2}
								>
									<span className="text-uppercse fs-3">
										2. Способ доставки
									</span>
								</Accordion.Header>
								<Accordion.Body>
									<Delivery
										busy={deliveryDetailFetching}
										sdek={deliveryDetail?.sdek}
										tariff_code={
											deliveryDetail?.tariff_code
										}
										address={deliveryDetail?.address}
										code={deliveryDetail?.code}
										period_max={deliveryDetail?.period_max}
										period_min={deliveryDetail?.period_min}
										total_sum={deliveryDetail?.total_sum}
									/>
								</Accordion.Body>
							</Accordion.Item>
							<Fade
								in={
									!!deliveryDetail?.address &&
									activeKey !== "2"
								}
							>
								<Stack className="my-5" dir="verical" gap={3}>
									<div>
										<span>Выбрано: </span>
										<b>
											{deliveryDetail?.sdek && "СДЭК"},{" "}
											{deliveryDetail?.tariff_code === 139
												? "Курьером"
												: "Самовывоз"}
										</b>
									</div>
									<div>
										<span>
											{deliveryDetail?.tariff_code === 139
												? "Адрес"
												: "Пункт выдачи"}
											:{" "}
										</span>
										<b>{deliveryDetail?.address}</b>
									</div>
									<div>
										<span>Стоимость: </span>
										<b>
											{deliveryDetail?.total_sum} руб.,{" "}
											{deliveryDetail?.period_min}-
											{deliveryDetail?.period_max} дней
										</b>
									</div>
								</Stack>
							</Fade>
							<Accordion.Item
								eventKey="3"
								className="border-0 border-bottom"
							>
								<Accordion.Header
									onClick={accordionHandler}
									data-key={3}
								>
									<span className="text-uppercse fs-3">
										3. Получатель
									</span>
								</Accordion.Header>
								<Accordion.Body>
									<Recipient
										name={recipient?.name}
										mail={recipient?.mail}
										phone={recipient?.phone}
									/>
								</Accordion.Body>
							</Accordion.Item>
							<Fade
								in={
									!!recipient?.phone &&
									!!recipient?.name &&
									!!recipient?.mail &&
									activeKey !== "3"
								}
							>
								<Stack className="my-5" dir="verical" gap={3}>
									<div>
										<span>Получатель: </span>
										<b>{recipient?.name}</b>
									</div>
									<div>
										<span>Телефон: </span>
										<b>
											{parsePhoneValue(
												recipient?.phone || ""
											)}
										</b>
									</div>
									<div>
										<span>E-mail: </span>
										<b>{recipient?.mail}</b>
									</div>
								</Stack>
							</Fade>
							<Accordion.Item
								eventKey="4"
								className="border-0 border-bottom"
							>
								<Accordion.Header
									onClick={accordionHandler}
									data-key={4}
								>
									<span className="text-uppercse fs-3">
										4. Товары в заказе
									</span>
								</Accordion.Header>
								<Accordion.Body>
									{ products.length + variants.length === 0 && <div className="text-muted">
										Товары отсутствуют
									</div> }
									<ListGroup variant="flush">
										{activeKey === "4" &&
											cart?.products
												.filter(({ productId }) =>
													products.some(
														(item) =>
															item.productId ===
															productId
													)
												)
												.map(
													({
														productId,
														quantity,
													}) => (
														<OrderItem
															key={productId}
															productId={
																productId
															}
															quantity={quantity}
														/>
													)
												)}
										{activeKey === "4" &&
											cart?.variants
												.filter(({ variantId }) =>
													variants.some(
														(item) =>
															item.variantId ===
															variantId
													)
												)
												.map(
													({
														productId,
														variantId,
														quantity,
													}) => (
														<OrderItem
															key={productId}
															productId={
																productId
															}
															quantity={quantity}
															variantId={
																variantId
															}
														/>
													)
												)}
									</ListGroup>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</Col>
					<Col xs={12} lg={4}></Col>
				</Row>
			</Fade>
			<Fade
				in={
					!(
						deliveryCityFetching &&
						deliveryDetailLoading &&
						recipientLoading &&
						cartLoading
					)
				}
			>
				<Row className="mt-5 justify-content-center">
					<Col xs="auto">
						<ButtonComponent
							onClick={() => createOrder({ products, variants })}
							isLoading={isLoading}
							disabled={
								!deliveryCity ||
								!deliveryDetail?.address ||
								!(recipient?.name &&
									recipient?.mail &&
									recipient.phone) || (products.length + variants.length === 0)
							}
						>
							<span className="text-uppercase">
								Оформить заказ
							</span>
						</ButtonComponent>
					</Col>
				</Row>
			</Fade>
		</Container>
	)
}

export default OrderPage