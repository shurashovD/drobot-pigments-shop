import { FC, useState } from "react"
import { Button, Col, Collapse, Container, Row, Spinner } from "react-bootstrap"
import { useGetOrderQuery } from "../../../application/profile.service"
import OrderProductComponent from "./OrderProductComponent"
import OrderSdekComponent from "./OrderSdekComponent"
import OrderStatusComponent from "./OrderStatusComponent"

interface IProps {
	id: string
}

const OrderComponent: FC<IProps> = ({ id }) => {
	const { data, isLoading } = useGetOrderQuery(id)
	const formatter = new Intl.DateTimeFormat('ru', {
		day: 'numeric', month: 'long', year: 'numeric'
	})
	const priceFormatter = new Intl.NumberFormat('ru', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0
	})
	const [show, setShow] = useState(false)

	return (
		<div className="border border-dark p-4 px-0 mb-6">
			{isLoading && (
				<div className="text-center">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{data && !isLoading && (
				<div className="d-flex flex-wrap mb-4 px-2 px-lg-5">
					<div className="text-uppercase mb-2 w-100">Заказ № {data?.number}</div>
					<div className="d-flex align-items-center">
						<OrderStatusComponent status={data.status} />
						{data?.payment && data?.payment?.status !== "canceled" && data?.status === "new" && data.payment.paymentUrl && (
							<div className="ms-3 my-2">
								<a href={data.payment.paymentUrl} className="border border-dark p-2 px-4 text-uppercase" target="_blank">
									Оплатить
								</a>
							</div>
						)}
					</div>
				</div>
			)}
			{data && !isLoading && <hr className="bg-dark mb-6" style={{ height: "4px" }} />}
			{data && !isLoading && (
				<div className="px-2 px-lg-5">
					<Row>
						<Col xs={12} md={6}>
							{data.products.map(({ product, quantity, price, discountOn, paidByCashBack }) => (
								<OrderProductComponent
									key={product._id.toString()}
									name={product.name}
									imageSrc={product.photo[0]}
									price={price - (discountOn || 0) - (paidByCashBack || 0)}
									quantity={quantity}
								/>
							))}
							{data.variants.map(({ product, variant, quantity, price, discountOn, paidByCashBack }) => (
								<OrderProductComponent
									key={variant.toString()}
									name={product.name}
									imageSrc={product.photo[0]}
									price={price - (discountOn || 0) - (paidByCashBack || 0)}
									quantity={quantity}
									variant={product.variants.find(({ _id }) => _id?.toString() === variant.toString())?.name}
								/>
							))}
						</Col>
						<Col xs={12} md={6} className="d-none d-md-block">
							<div className="mb-5">
								<span className="text-muted">Дата оформления:</span> <span>{formatter.format(Date.parse(data.date))}</span>
							</div>
							<div className="mb-5">
								<div className="text-uppercase mb-2">Способ оплаты:</div>
								<div>
									<span className="text-muted">Карта, он-лайн: </span>
									<span>{priceFormatter.format(data.total + (data.delivery.sdek?.cost || 0))}</span>
									{", "}
									{!data.payment?.status && <span className="text-danger">Не оплачено</span>}
									{data.payment?.status === "pending" && <span className="text-danger">Ожидает оплаты</span>}
									{data.payment?.status === "succeeded" && <span>Оплачено</span>}
									{data.payment?.status === "canceled" && <span className="text-danger">Ошибка оплаты</span>}
								</div>
							</div>
							{!!data.delivery.sdek?.uuid && (
								<div className="mb-5">
									<div className="text-uppercase mb-2">Способ получения:</div>
									<OrderSdekComponent id={id} cost={data.delivery.sdek.cost} />
								</div>
							)}
							{!!data.delivery.pickup?.checked && (
								<div className="mb-5">
									<div className="text-uppercase mb-2">Способ получения:</div>
									<div>Самовывоз из магазина</div>
								</div>
							)}
						</Col>
						<Container className="d-md-none px-2">
							<hr className="d-md-none opacity-25" />
							<Button className="text-muted p-0 pb-5" variant="link" onClick={() => setShow((state) => !state)}>
								{show ? <>Скрыть подробности</> : <>Подробнее</>}
							</Button>
							<Collapse in={show}>
								<Col xs={12} md={6}>
									<div className="mb-5">
										<span className="text-muted">Дата оформления:</span> <span>{formatter.format(Date.parse(data.date))}</span>
									</div>
									<div className="mb-5">
										<div className="text-uppercase mb-2">Способ оплаты:</div>
										<div>
											<span>{priceFormatter.format(data.total + (data.delivery.sdek?.cost || 0))}</span>
											{", "}
											{!data.payment?.status && <span className="text-danger">Не оплачено</span>}
											{data.payment?.status === "pending" && <span className="text-danger">Ожидает оплаты</span>}
											{data.payment?.status === "succeeded" && <span>Оплачено</span>}
											{data.payment?.status === "canceled" && <span className="text-danger">Ошибка оплаты</span>}
										</div>
									</div>
									{(!!data.delivery.sdek?.uuid || data.delivery.pickup?.checked) && (
										<div className="mb-5">
											<div className="text-uppercase mb-2">Способ получения:</div>
											{data.delivery.sdek && <OrderSdekComponent id={id} cost={data.delivery.sdek.cost} />}
											{data.delivery.pickup?.checked && <div>самовывоз из магазина (г. Краснодар, ул. Дзержинского 87/1)</div>}
										</div>
									)}
								</Col>
							</Collapse>
						</Container>
					</Row>
				</div>
			)}
		</div>
	)
}

export default OrderComponent