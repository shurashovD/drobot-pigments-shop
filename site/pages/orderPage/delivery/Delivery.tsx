import { useEffect, useState } from "react"
import { Button, Col, Collapse, Fade, Row } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetDeliveryDetailQuery } from "../../../application/order.service"
import { setActive, setSdek, setSdekTariff } from "../../../application/orderSlice"
import SdekDetail from "./SdekDetail"
import SdekTariff from "./SdekTariff"

const Delivery = () => {
    const { data, isLoading } = useGetDeliveryDetailQuery(undefined)
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
		}
	}, [data])

	useEffect(() => {
		dispatch(setSdek(!!data?.sdek))
		dispatch(setSdekTariff({ address: data?.address, pvz: data?.code, tariff: data?.tariff_code }))
	}, [data, dispatch, setSdek, setSdekTariff])

    return (
		<Row>
			<Col lg={6}>
				<SdekTariff />
			</Col>
			<Col lg={6} />
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