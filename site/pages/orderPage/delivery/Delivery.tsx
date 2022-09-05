import { FC, useEffect, useState } from "react"
import { Button, Col, Fade, Row } from "react-bootstrap"
import { useGetDeliveryDetailQuery } from "../../../application/order.service"
import SdekDetail from "./SdekDetail"
import SdekTariff from "./SdekTariff"

interface IProps {
	readyHandler: () => void
}

const Delivery: FC<IProps> = ({ readyHandler }) => {
    const { data, isLoading } = useGetDeliveryDetailQuery(undefined)
	const [show, setShow] = useState(false)

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
				<Fade in={show}>
					<div>
						<div className="mb-2">
							{data?.sdek && <>СДЭК, </>}
							{data?.tariff_code === 138 && <>самовывоз, </>}
							{data?.tariff_code === 139 && <>курьер, </>}
							{data?.tariff_code === 366 && <>постамат, </>}
							{data?.address}
						</div>
						<Button onClick={() => readyHandler()}>Далее</Button>
					</div>
				</Fade>
			</Col>
		</Row>
	)
}

export default Delivery