import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"
import CheckboxComponent from "../../../components/CheckboxComponent"

const Pickup = () => {
    const [state, setState] = useState(false)
    const { data, isFetching, isSuccess } = useGetDeliveryDetailQuery(undefined)
    const [setDelivery, { isLoading: setLoading }] = useSetDeliveryDetailMutation()

    useEffect(() => {
        if ( data ) {
            setState(!!data.pickup)
        }
    }, [data, isSuccess])

    return (
		<Row>
			<Col xs="auto">
				<CheckboxComponent
					checked={state}
					isLoading={isFetching || setLoading}
					onChange={() => setDelivery({ sdek: false, pickup: !state })}
					style={{ zIndex: 1100 }}
				/>
			</Col>
			<Col>
				<div className="text-muted">Самовывоз из магазина в г. Краснодар</div>
			</Col>
		</Row>
	)
}

export default Pickup