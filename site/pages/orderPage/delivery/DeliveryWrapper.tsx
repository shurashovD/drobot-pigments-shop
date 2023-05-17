import classNames from "classnames"
import { Button, Collapse, Stack } from "react-bootstrap"
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
	let formatter = null
	try {
		formatter = new Intl.NumberFormat('ru', {
			style: 'unit',
			unit: 'day',
			notation: 'standard'
		})
	} catch (e) {}

    return (
		<>
			<Button
				id="order-delivery"
				variant="link"
				onClick={() => dispatch(setActive(eventKey))}
				disabled={disabled}
				className={classNames("order-accordion__btn mt-5", { collapsed: activeKey === eventKey, empty: empty })}
			>
				<span className="text-uppercse fs-3">2. Способ доставки</span>
			</Button>
			<Collapse in={activeKey === eventKey}>
				<div className="mt-2">
					<Delivery />
				</div>
			</Collapse>
			<Collapse in={!!deliveryDetail?.address && activeKey !== eventKey}>
				<Stack className="mt-5" dir="verical" gap={3}>
					<div>
						<span>Выбрано: </span>
						{deliveryDetail?.sdek && <b>СДЭК, {deliveryDetail?.tariff_code === 139 ? "Курьером" : "Самовывоз"}</b>}
						{deliveryDetail?.pickup && <b>Самовывоз из магазина</b>}
					</div>
					<div>
						{deliveryDetail?.sdek && <span>{deliveryDetail?.tariff_code === 139 ? "Адрес" : "Пункт выдачи"}: </span>}
						{deliveryDetail?.pickup && <span>Адрес: </span>}
						<b>{deliveryDetail?.address}</b>
					</div>
					<div>
						<span>Стоимость: </span>
						{deliveryDetail?.period_max && (
							<b>
								{deliveryDetail?.total_sum} руб.
								{formatter && (
									<>
										, {deliveryDetail.period_min}-{formatter.format(deliveryDetail.period_max)}
									</>
								)}
							</b>
						)}
						{deliveryDetail?.pickup && <b>бесплатно</b>}
					</div>
				</Stack>
			</Collapse>
		</>
	)
}

export default DeliveryWrapper