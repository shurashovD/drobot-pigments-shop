import { FC, useEffect } from "react"
import { Button, Collapse, Fade } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { useGetDeliveryCityQuery } from "../../../application/order.service"
import { setActive, setCity } from "../../../application/orderSlice"
import Region from "./Region"
import classnames from 'classnames'

const RegionWrapper = () => {
	const eventKey = "1"
	const { active: activeKey } = useAppSelector(state => state.orderSlice)
	const disabled = useAppSelector(state => !state.orderSlice.available.includes(eventKey))
	const empty = useAppSelector((state) => state.orderSlice.empty.includes(eventKey))
	const { data: deliveryCity } = useGetDeliveryCityQuery(undefined)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setCity(deliveryCity?.city))
	}, [deliveryCity, dispatch, setCity])

	return (
		<>
			<Button id="order-region" variant="link" onClick={() => dispatch(setActive(eventKey))}
				disabled={disabled}
				className={classnames("order-accordion__btn", { "collapsed": activeKey === eventKey, "empty": empty })}
			>
				<span className="text-uppercse fs-3">1. Регион доставки</span>
			</Button>
			<Collapse in={activeKey === eventKey}>
				<div className="mt-2">
					<Region city={deliveryCity?.city} code={deliveryCity?.city_code} />
				</div>
			</Collapse>
			<Fade in={!!deliveryCity && activeKey !== eventKey}>
				<div className="my-5">
					<span>Город доставки: </span>
					<b>
						{deliveryCity?.region}, {deliveryCity?.city}
					</b>
				</div>
			</Fade>
		</>
	)
}

export default RegionWrapper