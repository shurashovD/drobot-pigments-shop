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
    const [number, setNumber] = useState("")
    const [value, setValue] = useState("")
	const [numberInvalid, setNumberInvalid] = useState(false)
    const [showModal, setShowModal] = useState(false)

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
		setNumber(event.target.value.substring(1))
		setNumberInvalid(false)
	}

    useEffect(() => {
		setValue(`+${number}`)
	}, [number])

    useEffect(() => {
		if (isSuccess) {
			setShowModal(true)
		}
	}, [isSuccess])

	useEffect(() => {
		if ( data?.phone ) {
			setNumber(data.phone)
		}
	}, [data])

    return (
		<Row className="gy-3 gy-lg-0">
			<CheckPhoneModal show={showModal} onHide={() => setShowModal(false)} />
			<Col xs={12} md={6}>
				<Row>
					<Col xs={12}>
						<Form.Group>
							<Form.Label>
								<small className={classNames({ "text-muted": !numberInvalid, "text-danger": numberInvalid })}>Номер</small>
							</Form.Label>
							<Form.Control
								disabled={!!auth?.counterpartyId}
								value={value}
								onChange={phoneHandler}
								onKeyDown={kdHandler}
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
						checkNumber={() => checkNumber(`${number}`)}
						numberIsChanged={`${number}` !== data?.phone}
						shortNumber={number.length < 10}
						isConfirm={!!data?.phone}
					/>
				)}
			</Col>
		</Row>
	)
}

export default PhoneComponent