import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { setOrderAlert, successAlert } from "../../application/alertSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useCheckPaymentProbablyQuery, useCreateOrderMutation, useGetCartQuery, useGetDeliveryCityQuery, useGetDeliveryDetailQuery, useGetRecipientQuery } from "../../application/order.service"
import { setActive } from "../../application/orderSlice"
import ButtonComponent from "../../components/ButtonComponent"

const CreateOrderBtn = () => {
	const [number, setNumber] = useState<string | undefined>()
	const [isPaying, setIsPaying] = useState(false)
    const { data: city } = useGetDeliveryCityQuery(undefined)
    const { data: detail } = useGetDeliveryDetailQuery(undefined)
    const { data: recipient } = useGetRecipientQuery(undefined)
	const { data: cart, refetch } = useGetCartQuery(undefined)
	const { data: payment } = useCheckPaymentProbablyQuery({ orderNumber: number || "" }, { pollingInterval: 3000, skip: !number || isPaying })
    const [createOrder, { isLoading, data }] = useCreateOrderMutation()
	const { active } = useAppSelector(state => state.orderSlice)
	const formatter = new Intl.NumberFormat('ru', { style: 'decimal' })
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const validate = () => {
		if (!city) {
			setTimeout(() => {
				dispatch(successAlert("Выберите город доставки"))
			})
			return "1"
		}
		if (!detail?.tariff_code && !detail?.pickup) {
			setTimeout(() => {
				dispatch(successAlert("Выберите способ доставки"))
			})
			return "2"
		}
		if (detail && detail.tariff_code === 139 && !detail.address) {
			setTimeout(() => {
				dispatch(successAlert("Укажите адрес доставки"))
			})
			return "2"
		}
		if (detail && (detail.tariff_code === 138 || detail.tariff_code === 366) && !detail.code) {
			setTimeout(() => {
				dispatch(successAlert("Выберите пункт выдачи"))
			})
			return "2"
		}
		
		if (!recipient?.phone) {
			setTimeout(() => {
				dispatch(successAlert("Подтвердите номер телефона"))
			})
			return "3"
		}
		if (!recipient?.name || !recipient?.mail) {
			setTimeout(() => {
				dispatch(successAlert("Укажите имя получателя и e-mail для обратной связи"))
			})
			return "3"
		}
	}

	const handler = () => {
		const target = validate()
		if ( !!target ) {
			if ( target !== active ) {
				dispatch(setActive(target))
			}
			return
		}
		if ( data?.url && data?.orderNumber ) {
			window.open(data.url, "_blank")
		} else {
			createOrder()
		}
	}

	useEffect(() => {
		if (data?.url) {
			window.open(data.url, "_blank")
		}
		if ( data?.orderNumber ) {
			setNumber(data.orderNumber)
		}
	}, [data])

	useEffect(() => {
		if (payment && payment.status === "succeeded") {
			setIsPaying(true)
			navigate("/")
			dispatch(setOrderAlert({ orderNumber: number || "", failedOrder: false }))
			refetch()
		}
		if (payment && payment.status === "canceled") {
			dispatch(setOrderAlert({ orderNumber: number || "", failedOrder: true }))
			navigate("/")
			refetch()
			setIsPaying(true)
		}
	}, [payment, refetch, dispatch, navigate, setOrderAlert, number])

    return (
		<Row className="mt-5 justify-content-center">
			<Col xs="auto">
				<ButtonComponent onClick={handler} isLoading={isLoading}>
					<span className="text-uppercase">
						{data?.url ? (
							<>Оплатить {formatter.format((cart?.total || 0) + (detail?.total_sum || 0))} руб.</>
						) : (
							<>Оформить заказ на сумму {formatter.format((cart?.total || 0) + (detail?.total_sum || 0))} руб.</>
						)}
					</span>
				</ButtonComponent>
			</Col>
		</Row>
	)
}

export default CreateOrderBtn