import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import { useCheckNumberInitMutation, useGetRecipientQuery, useSetRecipientMutation } from '../../../application/order.service'
import ButtonComponent from '../../../components/ButtonComponent'
import CheckPhoneModal from './CheckPhoneModal'
import RecipientNumberConfirm from './RecipientNumberConfirm'

interface IProps {
	readyHandler: () => void
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

const Recipient: FC<IProps> = ({ readyHandler }) => {
	const { data, isFetching } = useGetRecipientQuery(undefined)
    const [state, setState] = useState('')
	const [nameVal, setName] = useState('')
	const [mailVal, setMail] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberInitMutation()
	const [setRecipient, { isLoading: setRecipientLoading, isSuccess: setRecipientSuccess }] = useSetRecipientMutation()

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
			readyHandler()
		}
	}, [setRecipientSuccess])

    return (
		<Row>
			<CheckPhoneModal show={showModal} onHide={() => setShowModal(false)} />
			<Col xs={12}>
				<Row className="justify-content-between">
					<Col xs="auto">
						<span className="mb-2">Телефон*</span>
					</Col>
					<Col xs="auto" className="d-lg-none">
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
				<Row>
					<Col xs={12} md={6}>
						<Form.Control value={parsePhoneValue(state)} onChange={telHandler} className="h-100" />
					</Col>
					<Col xs={12} md={6} className="d-flex align-items-center">
						{isLoading && (
							<div className="py-3 px-4">
								<Spinner animation="border" size="sm" variant="danger" />
							</div>
						)}
						{!isLoading && !isFetching && (
							<div className="d-none d-lg-block">
								<RecipientNumberConfirm
									checkNumber={() => checkNumber(state)}
									numberIsChanged={state !== data?.phone}
									shortNumber={state.length < 10}
									isConfirm={!!data?.phone}
								/>
							</div>
						)}
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
								<div className="mb-2">E-mail*</div>
								<Form.Control
									className="py-3"
									value={mailVal}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setMail(e.target.value)}
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