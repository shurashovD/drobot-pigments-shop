import { useEffect, useState } from "react"
import { Button, Col, Collapse, Row } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetDeliveryDetailQuery, useGetDeliveryWaysQuery } from "../../../application/order.service"
import { setActive, setPickup, setSdek, setSdekTariff } from "../../../application/orderSlice"
import Pickup from "./Pickup"
import SdekDetail from "./SdekDetail"
import SdekTariff from "./SdekTariff"

const Delivery = () => {
    const { data, isLoading } = useGetDeliveryDetailQuery(undefined)
	const { data: ways } = useGetDeliveryWaysQuery()
	const [show, setShow] = useState(false)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( data?.sdek ) {
			if ( (data.tariff_code === 138 || data.tariff_code === 366) && data.code ) {
				setShow(true)
			} else {
				if (data.tariff_code === 139 && data.address) {
					setShow(true)
				} else {
					setShow(false)
				}
			}
		} else {
			if ( data?.pickup ) {
				setShow(true)
			} else {
				setShow(false)
			}
		}
	}, [data])

	useEffect(() => {
		dispatch(setSdek(!!data?.sdek))
		dispatch(setSdekTariff({ address: data?.address, pvz: data?.code, tariff: data?.tariff_code }))
		dispatch(setPickup(!!data?.pickup))
	}, [data, dispatch, setSdek, setSdekTariff])

    return (
		<Row>
			{ways?.sdek && (
				<Col lg={6}>
					<SdekTariff />
				</Col>
			)}
			{ways?.pickup && (
				<Col lg={6}>
					<Pickup />
				</Col>
			)}
			<Col lg={12} className="mt-5 mb-4">
				{!isLoading && !!data?.sdek && <SdekDetail />}
			</Col>
			<Col xs={12}>
				<Collapse in={show}>
					<div>
						<div className="mb-2">
							{data?.sdek && <>СДЭК, </>}
							{data?.tariff_code === 138 && <>самовывоз, </>}
							{data?.tariff_code === 139 && <>курьер, </>}
							{data?.tariff_code === 366 && <>постамат, </>}
							{data?.pickup && <div>Самовывоз из магазина</div>}
							{data?.address}
						</div>
						<Button onClick={() => dispatch(setActive("3"))}>Далее</Button>
					</div>
				</Collapse>
			</Col>
		</Row>
	)
}

export default Delivery