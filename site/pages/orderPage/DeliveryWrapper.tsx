import { FC } from "react"
import { Accordion, Fade, Stack } from "react-bootstrap"
import { useGetDeliveryDetailQuery } from "../../application/order.service"
import Delivery from "./Delivery"

interface IProps {
	activeKey?: string
	accordionHandler: (key: string) => void
}

const DeliveryWrapper: FC<IProps> = ({ accordionHandler, activeKey }) => {
    const eventKey = "2"
    const { data: deliveryDetail } = useGetDeliveryDetailQuery(undefined)

    return (
		<>
			<Accordion.Item eventKey="2" className="border-0 border-bottom" id="order-delivery">
				<Accordion.Header onClick={() => accordionHandler(eventKey)}>
					<span className="text-uppercse fs-3">2. Способ доставки</span>
				</Accordion.Header>
				<Accordion.Body>
					<Delivery readyHandler={() => accordionHandler("3")} />
				</Accordion.Body>
			</Accordion.Item>
			<Fade in={!!deliveryDetail?.address && activeKey !== "2"}>
				<Stack className="my-5" dir="verical" gap={3}>
					<div>
						<span>Выбрано: </span>
						<b>
							{deliveryDetail?.sdek && "СДЭК"}, {deliveryDetail?.tariff_code === 139 ? "Курьером" : "Самовывоз"}
						</b>
					</div>
					<div>
						<span>{deliveryDetail?.tariff_code === 139 ? "Адрес" : "Пункт выдачи"}: </span>
						<b>{deliveryDetail?.address}</b>
					</div>
					<div>
						<span>Стоимость: </span>
						<b>
							{deliveryDetail?.total_sum} руб., {deliveryDetail?.period_min}-{deliveryDetail?.period_max} дней
						</b>
					</div>
				</Stack>
			</Fade>
		</>
	)
}

export default DeliveryWrapper