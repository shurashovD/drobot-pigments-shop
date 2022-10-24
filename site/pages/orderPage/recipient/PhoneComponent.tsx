import classNames from "classnames"
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react"
import { Col, Form, Row, Spinner } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"
import { useCheckNumberInitMutation, useGetRecipientQuery } from "../../../application/order.service"
import CheckPhoneModal from "./CheckPhoneModal"
import RecipientNumberConfirm from "./RecipientNumberConfirm"

const PhoneComponent = () => {
    const { data: auth } = useAccountAuthQuery(undefined)
    const { data, isFetching } = useGetRecipientQuery(undefined)
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberInitMutation()
    const [country, setCountry] = useState("7")
    const [number, setNumber] = useState("")
    const [value, setValue] = useState("")
	const [codeInvalid, setCodeInvalid] = useState(false)
	const [numberInvalid, setNumberInvalid] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const codeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.substring(1)
		if (value === "" || !isNaN(+value)) {
			setCountry(value)
			setCodeInvalid(false)
		}
	}

	const kdHandler: KeyboardEventHandler = (event) => {
		const { key } = event
		if (key === "Backspace") {
			setNumber("")
		}
		if (isNaN(+key)) {
			event.preventDefault()
		}
	}

	const phoneHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target
		if (number.length === 10) {
			return
		}
		const numberValue = value
			.split("")
			.filter((item) => item !== " ")
			.join("")
		setNumber(numberValue)
		setNumberInvalid(false)
	}

    useEffect(() => {
		const codeEnd = 3
		const firstEnd = 6
		const secondEnd = 8
		const code = number.substring(0, codeEnd)
		const first = number.substring(codeEnd, firstEnd)
		const second = number.substring(firstEnd, secondEnd)
		const fird = number.substring(secondEnd)
		let value = code
		if (first.length > 0) {
			value += " " + first
		}
		if (second.length > 0) {
			value += " " + second
		}
		if (fird.length > 0) {
			value += " " + fird
		}
		setValue(value)
	}, [number])

    useEffect(() => {
		if (isSuccess) {
			setShowModal(true)
		}
	}, [isSuccess])

	useEffect(() => {
		console.log(data)
		if ( data?.phone ) {
			const code = data.phone.substring(0, data.phone.length - 10)
			const number = data.phone.substring(data.phone.length - 10)
			setCountry(code)
			setNumber(number)
		}
	}, [data])

    return (
		<Row className="gy-3 gy-lg-0">
			<CheckPhoneModal show={showModal} onHide={() => setShowModal(false)} />
			<Col xs={12} md={6}>
				<Row>
					<Col xs={3}>
						<Form.Group>
							<Form.Label>
								<small className={classNames({ "text-muted": !codeInvalid, "text-danger": codeInvalid })}>Код</small>
							</Form.Label>
							<Form.Control value={`+${country}`} onChange={codeHandler} placeholder="+7" className="p-3 text-center" />
						</Form.Group>
					</Col>
					<Col xs={9}>
						<Form.Group>
							<Form.Label>
								<small className={classNames({ "text-muted": !numberInvalid, "text-danger": numberInvalid })}>Номер</small>
							</Form.Label>
							<Form.Control
								disabled={!!auth?.counterpartyId}
								value={value}
								onChange={phoneHandler}
								onKeyDown={kdHandler}
								placeholder="123 456 78 90"
								className="p-3"
							/>
						</Form.Group>
					</Col>
				</Row>
			</Col>
			<Col xs={12} md={6} className="text-center text-md-start d-flex align-items-end">
				{isLoading && <Spinner animation="border" size="sm" variant="secondary" />}
				{!isLoading && !isFetching && (
					<RecipientNumberConfirm
						checkNumber={() => checkNumber(`${country}${number}`)}
						numberIsChanged={`${country}${number}` !== data?.phone}
						shortNumber={number.length < 10}
						isConfirm={!!data?.phone}
					/>
				)}
			</Col>
		</Row>
	)
}

export default PhoneComponent