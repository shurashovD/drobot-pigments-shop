import { Image, Modal, ModalProps, Spinner } from 'react-bootstrap'
import { FC, useEffect, useState } from 'react'
import { useCheckPaymentProbablyQuery, useGetCartQuery } from '../../application/order.service'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../application/hooks'
import { setOrderAlert } from '../../application/alertSlice'
const logo = require('../../img/logo.svg')
 
interface IProps extends ModalProps {
    number?: string
	url?: string
}

const FinalModal: FC<IProps> = ({ show, onHide, number, url }) => {
	const [isPaying, setIsPaying] = useState(false)
	const { data } = useCheckPaymentProbablyQuery({ orderNumber: number || '' }, { pollingInterval: 3000, skip: !show || isPaying })
	const { refetch } = useGetCartQuery(undefined)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	useEffect(() => {
		console.log(data, data.status);
		if (data && data.status === "succeeded") {
			setIsPaying(true)
			navigate("/")
			dispatch(setOrderAlert({ orderNumber: number || '', failedOrder: false }))
			refetch()
		}
		if (data && data.status === "canceled") {
			dispatch(setOrderAlert({ orderNumber: number || "", failedOrder: true }))
			navigate("/")
			refetch()
			setIsPaying(true)
		}
	}, [data, refetch, dispatch, navigate, setOrderAlert, number])

	useEffect(() => {
		setIsPaying(false)
	}, [show])

	useEffect(() => {
		if ( url ) {
			window.open(url, "_blank")
		}
	}, [url])

    return (
		<Modal show={show} onHide={onHide}>
			<Modal.Body className="bg-primary pb-6 px-5">
				<Modal.Header
					closeButton={data && (data.status === "succeeded" || data.status === "canceled")}
					closeVariant="white"
					className="border-0"
				/>
				<div className="text-uppercase text-white text-center mb-3">
					{(!data || data.status === "pending") && <>Заказ №{number} ожидает оплаты...</>}
					{data && data.status === "probably" && (
						<>Процесс оплаты завершен, но деньги к нам еще не поступили. Пожалуйста, подождите еще немного до завершения платежа.</>
					)}
				</div>
				{(!data || data.status === "pending" || data.status === "probably") && (
					<div className="text-center mb-4">
						<Spinner animation="border" size="sm" variant="secondary" />
					</div>
				)}
				{data && data.status !== "pending" && (
					<div className="text-white text-clearInterval mb-4">
						Вы можете отследить заказ в <NavLink to="/profile">личном кабинете</NavLink>
					</div>
				)}
				<div className="text-center mb-5">
					<Image src={logo} width={106} />
				</div>
				<div className="text-center text-muted">
					{!data || data.status === "pending" ? (
						<>
							Перейдите на{" "}
							<a target="_blank" href={url} className="text-secondary">
								вкладку оплаты
							</a>
							, если оплата произведена, подождите немного.
						</>
					) : (
						<>В течении 15 минут с вами свяжется менеджер.</>
					)}
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default FinalModal