import { useEffect, useState } from "react"
import { Col, Fade, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../application/hooks"
import { useCreateOrderMutation, useGetDeliveryCityQuery, useGetDeliveryDetailQuery, useGetRecipientQuery } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
import FinalModal from "./FinalModal"

const CreateOrderBtn = () => {
    const { data: city, isFetching: cityFetching } = useGetDeliveryCityQuery(undefined)
    const { data: detail, isFetching: detailFetching } = useGetDeliveryDetailQuery(undefined)
    const { data: recipient, isFetching: recipientFetching } = useGetRecipientQuery(undefined)
    const [createOrder, { isLoading, data, isSuccess }] = useCreateOrderMutation()
    const { checkedProducts, checkedVariants } = useAppSelector(state => state.cartSlice)
    const [fadeIn, setFadeIn] = useState(true)
    const [disabled, setDisabled] = useState(true)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    const hideHandler = () => {
		setShow(false)
		navigate("/")
	}

    useEffect(() => {
        setFadeIn(!(cityFetching || detailFetching || recipientFetching))
    }, [cityFetching, detailFetching, recipientFetching])

    useEffect(() => {
        setDisabled(
            !(city && detail?.address && recipient?.name && recipient.mail && recipient.phone)
        )
        setDisabled(checkedProducts.length + checkedVariants.length === 0)
    }, [city, detail, recipient, checkedProducts, checkedVariants])

    useEffect(() => {
		if (isSuccess && data) {
			setShow(true)
		}
	}, [isSuccess, data])

    return (
		<>
			<FinalModal number={data?.orderNumber} show={show} onHide={hideHandler} url={data?.url} />
			<Fade in={fadeIn}>
				<Row className="mt-5 justify-content-center">
					<Col xs="auto">
						<ButtonComponent
							onClick={() => createOrder({ products: checkedProducts, variants: checkedVariants })}
							isLoading={isLoading}
							disabled={disabled}
						>
							<span className="text-uppercase">Оформить заказ</span>
						</ButtonComponent>
					</Col>
				</Row>
			</Fade>
		</>
	)
}

export default CreateOrderBtn