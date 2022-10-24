import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAppDispatch } from '../../../application/hooks'
import { useGetRecipientQuery } from '../../../application/order.service'
import { setNameMail, setPhone } from '../../../application/orderSlice'
import NameMail from './NameMail'
import PhoneComponent from './PhoneComponent'

const Recipient = () => {
	const { data } = useGetRecipientQuery(undefined)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setNameMail({ name: data?.name, mail: data?.mail }))
		dispatch(setPhone(data?.phone))
	}, [data, dispatch, setNameMail, setPhone])

    return (
		<Row>
			<Col xs={12}>
				<div className="mb-2">Телефон*</div>
				<PhoneComponent />
				<Row className="justify-content-start g-1 mt-1">
					<Col xs="auto" className="d-flex align-items-center">
						<input type="checkbox" checked={true} className="bg-dark" readOnly />
					</Col>
					<Col xs={8}>
						Принимаю условия{" "}
						<NavLink to="/privacy-policy" className="text-decoration-underline">
							соглашения о конфиденциальности
						</NavLink>
					</Col>
				</Row>
				<NameMail show={true} />
			</Col>
		</Row>
	)
}

export default Recipient