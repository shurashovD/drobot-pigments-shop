import classNames from "classnames"
import { Button, Collapse, Fade, Stack } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { useGetDeliveryDetailQuery } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import Delivery from "./Delivery"

const DeliveryWrapper = () => {
    const eventKey = "2"
	const { active: activeKey } = useAppSelector((state) => state.orderSlice)
	const disabled = useAppSelector((state) => !state.orderSlice.available.includes(eventKey))
	const empty = useAppSelector((state) => state.orderSlice.empty.includes(eventKey))
    const { data: deliveryDetail } = useGetDeliveryDetailQuery(undefined)
	const dispatch = useAppDispatch()
	const formatter = new Intl.NumberFormat('ru', {
		style: 'unit',
		unit: 'day',
		notation: 'standard'
	})

    return (
		<>
			<Button
				id="order-delivery"
				variant="link"
				onClick={() => dispatch(setActive(eventKey))}
				disabled={disabled}
				className={classNames("order-accordion__btn", { collapsed: activeKey === eventKey, empty: empty })}
			>
				<span className="text-uppercse fs-3">2. Способ доставки</span>
			</Button>
			<Collapse in={activeKey === eventKey}>
				<div className="mt-2">
					<Delivery />
				</div>
			</Collapse>
			<Fade in={!!deliveryDetail?.address && activeKey !== eventKey}>
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
						{deliveryDetail?.period_max && (
							<b>
								{deliveryDetail?.total_sum} руб., {deliveryDetail.period_min}-{formatter.format(deliveryDetail.period_max)}
							</b>
						)}
					</div>
				</Stack>
			</Fade>
		</>
	)
}

export default DeliveryWrapper