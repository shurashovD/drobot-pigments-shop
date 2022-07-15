import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useCheckNumberInitMutation, useSetRecipientMutation } from '../../application/order.service'
import ButtonComponent from '../../components/ButtonComponent'
import IconGreenCheckmark from '../../components/icons/IconGreenCheckmark'
import CheckPhoneModal from './CheckPhoneModal'

interface IProps {
    name?: string
    mail?: string
    phone?: string
}

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

const Recipient: FC<IProps> = ({ name, mail, phone }) => {
    const [state, setState] = useState('')
	const [nameVal, setName] = useState('')
	const [mailVal, setMail] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberInitMutation()
	const [setRecipient, { isLoading: setRecipientLoading }] = useSetRecipientMutation()

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

    useEffect(() => {
        if ( phone ) {
            setState(phone)
        }
    }, [phone])

	useEffect(() => {
		if (name) {
			setName(name)
		}
	}, [name])

	useEffect(() => {
		if (mail) {
			setMail(mail)
		}
	}, [mail])
    
	useEffect(() => {
		if ( isSuccess ) {
			setShowModal(true)
		}
	}, [isSuccess])

    return (
		<Row>
			<CheckPhoneModal
				show={showModal}
				onHide={() => setShowModal(false)}
			/>
			<Col xs={12}>
				<Row className="justify-content-between">
					<Col xs="auto">
						<span className="mb-2">Телефон*</span>
					</Col>
					<Col xs="auto">
						{!isLoading && !phone && (
							<Button
								variant="link"
								className="sign-tel-btn d-lg-none"
								disabled={state.length < 10}
								onClick={() => checkNumber(state)}
							>
								Подтвердить номер
							</Button>
						)}
						{!isLoading && phone && (
							<div className="d-flex d-lg-none align-items-center">
								{state === phone && (
									<IconGreenCheckmark stroke="#93FA82" />
								)}
								<Button
									variant="link"
									className="sign-tel-btn-success ms-2"
									disabled={state.length < 10}
									onClick={() =>
										state !== phone
											? checkNumber(state)
											: {}
									}
								>
									{state === phone ? (
										<>Номер подтверждён</>
									) : (
										<>Привязать новый</>
									)}
								</Button>
							</div>
						)}
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={6}>
						<Form.Control
							value={parsePhoneValue(state)}
							onChange={telHandler}
							className="h-100"
						/>
					</Col>
					<Col xs={12} md={6}>
						{isLoading && (
							<div className="py-3 px-4">
								<Spinner
									animation="border"
									size="sm"
									variant="danger"
								/>
							</div>
						)}
						{!isLoading && !phone && (
							<Button
								variant="link"
								className="sign-tel-btn my-3 d-none d-lg-block"
								disabled={state.length < 10}
								onClick={() => checkNumber(state)}
							>
								Подтвердить номер
							</Button>
						)}
						{!isLoading && phone && (
							<div className="d-none d-lg-flex align-items-center">
								{state === phone && (
									<IconGreenCheckmark stroke="#93FA82" />
								)}
								<Button
									variant="link"
									className="sign-tel-btn-success my-3 ms-2"
									disabled={state.length < 10}
									onClick={() =>
										state !== phone
											? checkNumber(state)
											: {}
									}
								>
									{state === phone ? (
										<>Номер подтверждён</>
									) : (
										<>Привязать новый</>
									)}
								</Button>
							</div>
						)}
					</Col>
				</Row>
				{!isLoading && phone && (
					<Row className="mt-2 mt-lg-5">
						<Col xs={12} lg={6}>
							<Form.Label className="w-100">
								<div className="mb-2">Получатель*</div>
								<Form.Control
									className="py-3"
									value={nameVal}
									onChange={(
										e: ChangeEvent<HTMLInputElement>
									) => setName(e.target.value)}
								/>
							</Form.Label>
						</Col>
						<Col xs={12} lg={6}>
							<Form.Label className="w-100">
								<div className="mb-2">E-mail*</div>
								<Form.Control
									className="py-3"
									value={mailVal}
									onChange={(
										e: ChangeEvent<HTMLInputElement>
									) => setMail(e.target.value)}
								/>
							</Form.Label>
						</Col>
					</Row>
				)}
				{!isLoading && phone && (
					<Row className="mt-5">
						<Col xs="auto">
							<ButtonComponent
								disabled={nameVal === "" || mailVal === ""}
								onClick={() =>
									setRecipient({
										name: nameVal,
										mail: mailVal,
									})
								}
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