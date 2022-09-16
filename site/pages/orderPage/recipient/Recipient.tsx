import classNames from 'classnames'
import { ChangeEvent, useEffect, useState } from 'react'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAppDispatch } from '../../../application/hooks'
import { useCheckNumberInitMutation, useGetRecipientQuery, useSetRecipientMutation } from '../../../application/order.service'
import { setActive, setNameMail, setPhone } from '../../../application/orderSlice'
import ButtonComponent from '../../../components/ButtonComponent'
import CheckPhoneModal from './CheckPhoneModal'
import RecipientNumberConfirm from './RecipientNumberConfirm'

const parsePhoneValue = (value: string) => {
	const code = value.substring(0, 3)
	const first = value.substring(3, 6)
	const second = value.substring(6, 8)
	const fird = value.substring(8, 10)
	let result = "+7 ("
	if (value.length > 0) {
		result += code
	}
	if (value.length >= 3) {
		result += `) ${first}`
	}
	if (value.length >= 6) {
		result += `-${second}`
	}
	if (value.length >= 8) {
		result += `-${fird}`
	}
	return result
}

const Recipient = () => {
	const { data, isFetching } = useGetRecipientQuery(undefined)
    const [state, setState] = useState('')
	const [nameVal, setName] = useState('')
	const [mailVal, setMail] = useState("")
	const [mailInvalid, setMailInvalid] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberInitMutation()
	const [setRecipient, { isLoading: setRecipientLoading, isSuccess: setRecipientSuccess }] = useSetRecipientMutation()
	const dispatch = useAppDispatch()

    const telHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setState((state) => {
			const { value } = event.target
			const code = value.substring(4, 7)
			const first = value.substring(9, 12)
			const second = value.substring(13, 15)
			const fird = value.substring(16, 18)
			const str = code + first + second + fird
			let tel = state.length > str.length ? "" : str
			return tel
		})
	}

	const setRecipientHandler = () => {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
		if ( reg.test(mailVal) ) {
			setRecipient({ mail: mailVal, name: nameVal })
		} else {
			setMailInvalid(true)
		}
	}

	const mailHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setMailInvalid(false)
		setMail(event.target.value.trim())
	}

    useEffect(() => {
        if ( data?.phone ) {
            setState(data.phone)
        }
		if (data?.name) {
			setName(data.name)
		}
		if (data?.mail) {
			setMail(data.mail)
		}
    }, [data])
    
	useEffect(() => {
		if ( isSuccess ) {
			setShowModal(true)
		}
	}, [isSuccess])

	useEffect(() => {
		if ( setRecipientSuccess ) {
			dispatch(setActive("4"))
		}
	}, [dispatch, setActive, setRecipientSuccess])

	useEffect(() => {
		dispatch(setNameMail({ name: data?.name, mail: data?.mail }))
		dispatch(setPhone(data?.phone))
	}, [data, dispatch, setNameMail, setPhone])

    return (
		<Row>
			<CheckPhoneModal show={showModal} onHide={() => setShowModal(false)} />
			<Col xs={12}>
				<Row className="justify-content-between">
					<Col xs="auto">
						<span className="mb-2">Телефон*</span>
					</Col>
				</Row>
				<Row className="gy-3">
					<Col xs={12} md={6}>
						<Form.Control value={parsePhoneValue(state)} onChange={telHandler} className="h-100 p-3" />
					</Col>
					<Col xs={12} md={6} className="text-center text-md-start d-flex align-items-center">
						{isLoading && <Spinner animation="border" size="sm" variant="secondary" />}
						{!isLoading && !isFetching && (
							<RecipientNumberConfirm
								checkNumber={() => checkNumber(state)}
								numberIsChanged={state !== data?.phone}
								shortNumber={state.length < 10}
								isConfirm={!!data?.phone}
							/>
						)}
					</Col>
				</Row>
				<Row className="justify-content-start g-1">
					<Col xs="auto" className="d-flex align-items-center">
						<input type="checkbox" checked={true} className="bg-dark" readOnly />
					</Col>
					<Col xs={8}>
						Принимаю условия{" "}
						<NavLink to="/" className="text-decoration-underline">
							соглашения о конфиденциальности
						</NavLink>
					</Col>
				</Row>
				{!isLoading && !isFetching && (
					<Row className="mt-2 mt-lg-5">
						<Col xs={12} lg={6}>
							<Form.Label className="w-100">
								<div className="mb-2">Получатель*</div>
								<Form.Control
									className="py-3"
									value={nameVal}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
								/>
							</Form.Label>
						</Col>
						<Col xs={12} lg={6}>
							<Form.Label className="w-100">
								<div className={classNames("mb-2", { "text-danger": mailInvalid })}>E-mail*</div>
								<Form.Control
									className={classNames("py-3", { "border-danger": mailInvalid })}
									value={mailVal}
									onChange={mailHandler}
								/>
							</Form.Label>
						</Col>
					</Row>
				)}
				{!isLoading && !isFetching && (
					<Row className="mt-5">
						<Col xs="auto">
							<ButtonComponent
								disabled={nameVal === "" || mailVal === "" || !data?.phone}
								onClick={setRecipientHandler}
								isLoading={setRecipientLoading}
							>
								Далее
							</ButtonComponent>
						</Col>
					</Row>
				)}
			</Col>
		</Row>
	)
}

export default Recipient