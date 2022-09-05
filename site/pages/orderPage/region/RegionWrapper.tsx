import { FC } from "react"
import { Accordion, Fade } from "react-bootstrap"
import { useGetDeliveryCityQuery } from "../../../application/order.service"
import Region from "./Region"

interface IProps {
    activeKey?: string
    accordionHandler: (key: string) => void
}

const RegionWrapper: FC<IProps> = ({ activeKey, accordionHandler }) => {
	const { data: deliveryCity } = useGetDeliveryCityQuery(undefined)
	const eventKey = "1"

	return (
		<>
			<Accordion.Item eventKey={eventKey} className="border-0 border-bottom" id="order-region">
				<Accordion.Header onClick={() => accordionHandler(eventKey)}>
					<span className="text-uppercse fs-3">1. Регион доставки</span>
				</Accordion.Header>
				<Accordion.Body>
					<Region city={deliveryCity?.city} readyHandler={() => accordionHandler("2")} />
				</Accordion.Body>
			</Accordion.Item>
			<Fade in={!!deliveryCity && activeKey !== eventKey}>
				<div className="my-5">
					<span>Город доставки: </span>
					<b>{deliveryCity?.region}, {deliveryCity?.city}</b>
				</div>
			</Fade>
		</>
	)
}

export default RegionWrapper