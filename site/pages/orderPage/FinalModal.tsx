import { Image, Modal, ModalProps, Spinner } from 'react-bootstrap'
import { FC, useEffect, useState } from 'react'
import { useCheckPaymentProbablyQuery, useClearCartAfterOrderMutation } from '../../application/order.service'
import { NavLink } from 'react-router-dom'
const logo = require('../../img/logo.svg')
 
interface IProps extends ModalProps {
    number?: string
	url?: string
}

const FinalModal: FC<IProps> = ({ show, onHide, number, url }) => {
	const [isPaying, setIsPaying] = useState(false)
	const { data } = useCheckPaymentProbablyQuery({ orderNumber: number || '' }, { pollingInterval: 3000, skip: !show || isPaying })
	const [clearCart] = useClearCartAfterOrderMutation()

	useEffect(() => {
		if ( data && number ) {
			clearCart({ orderNumber: number })
			setIsPaying(true)
		}
	}, [data, clearCart, number])

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
				<Modal.Header closeButton={isPaying} closeVariant="white" className="border-0" />
				<div className="text-uppercase text-white text-center mb-3">Заказ {isPaying ? <>оформлен успешно!</> : <>ожидает оплаты...</>}</div>
				<div className="text-uppercase text-white text-center mb-4">
					{isPaying ? <>Заказ №{number}</> : <Spinner animation="border" size="sm" variant="secondary" />}
				</div>
				{ isPaying && (
					<div className="text-white text-clearInterval mb-4">
						Отслеживайте статусы заказов в <NavLink to="/profile">личном кабинете</NavLink>
					</div>
				)}
				<div className="text-center mb-5">
					<Image src={logo} width={106} />
				</div>
				<div className="text-center text-muted">
					{isPaying ? (
						<>В течении 15 минут с вами свяжется менеджер.</>
					) : (
						<a target="_blank" href={url} className="text-secondary">
							Перейдите на вкладку оплаты, если оплата произведена, подождите немного.
						</a>
					)}
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default FinalModal