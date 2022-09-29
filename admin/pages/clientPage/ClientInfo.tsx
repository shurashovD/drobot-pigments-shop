import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { useDebiteCashbackMutation } from "../../application/users.service"
import ButtonComponent from "../../components/ButtonComponent"

interface IProps {
	clientId: string
    name: string
    totalCashBack: number
    availableCashBack: number
}

const ClientInfo: FC<IProps> = ({ availableCashBack, clientId, name, totalCashBack }) => {
	const [show, setShow] = useState(false)
	const [debite, { isLoading, isSuccess, reset }] = useDebiteCashbackMutation()
	const [state, setState] = useState(0)

	const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if ( event.target.value === '' ) {
			setState(0)
		}
		if ( !isNaN(+event.target.value) ) {
			setState(Math.min(+event.target.value, availableCashBack))
		}
	}

	const hideHandler = () => {
		setShow(false)
		setState(0)
	}

	useEffect(() => {
		if ( isSuccess ) {
			reset()
			hideHandler()
		}
	}, [isSuccess, reset])

    return (
		<Row className="justify-content-between">
			<Col xs="auto" className="d-flex align-items-center">
				<h3 className="m-0">{name}</h3>
			</Col>
			<Col xs="auto" className="d-flex flex-column justify-content-center align-items-end">
				<div>Доступный кэшбэк: {availableCashBack}</div>
				<div className="text-muted mb-2">Кэшбэк за всё время: {totalCashBack}</div>
				<Button size="sm" onClick={() => setShow(true)} disabled={availableCashBack === 0}>
					Вывести кэшбэк
				</Button>
			</Col>
			<Modal show={show} onHide={hideHandler}>
				<Modal.Header closeButton>Списание кэшбэка клиенту {name}</Modal.Header>
				<Modal.Body>
					<Form.Group>
						<Form.Label className="w-100">
							<span className="mb-1">Размер списания, руб</span>
							<Form.Control value={state} onChange={inputHandler} />
						</Form.Label>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<ButtonComponent
						disabled={state === 0}
						isLoading={isLoading}
						onClick={() => debite({ clientId, body: { total: state } })}
					>
						Списать
					</ButtonComponent>
				</Modal.Footer>
			</Modal>
		</Row>
	)
}

export default ClientInfo