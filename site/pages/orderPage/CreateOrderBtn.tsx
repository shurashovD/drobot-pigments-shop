import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useCreateOrderMutation, useGetCartQuery, useGetDeliveryCityQuery, useGetDeliveryDetailQuery, useGetRecipientQuery } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
import FinalModal from "./FinalModal"

const CreateOrderBtn = () => {
    const { data: city } = useGetDeliveryCityQuery(undefined)
    const { data: detail } = useGetDeliveryDetailQuery(undefined)
    const { data: recipient } = useGetRecipientQuery(undefined)
	const { data: cart } = useGetCartQuery(undefined)
    const [createOrder, { isLoading, data, isSuccess }] = useCreateOrderMutation()
    const [disabled, setDisabled] = useState(true)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
	const formatter = new Intl.NumberFormat('ru', {
		style: 'decimal',
	})

    const hideHandler = () => {
		setShow(false)
		navigate("/")
	}

    useEffect(() => {
		let cartDisabled = true
		if (cart) {
			cartDisabled = cart.products.filter(({ checked }) => checked).length + cart.variants.filter(({ checked }) => checked).length === 0
		}
        setDisabled(
            !(city && detail?.address && recipient?.name && recipient.mail && recipient.phone) || cartDisabled
        )
    }, [city, detail, recipient, cart])

    useEffect(() => {
		if (isSuccess && data) {
			setShow(true)
		}
	}, [isSuccess, data])

    return (
		<Row className="mt-5 justify-content-center">
			<FinalModal number={data?.orderNumber} show={show} onHide={hideHandler} url={data?.url} />
			<Col xs="auto">
				<ButtonComponent onClick={() => createOrder()} isLoading={isLoading} disabled={disabled}>
					<span className="text-uppercase">Оплатить { formatter.format((cart?.total || 0) + (detail?.total_sum || 0)) } руб.</span>
				</ButtonComponent>
			</Col>
		</Row>
	)
}

export default CreateOrderBtn