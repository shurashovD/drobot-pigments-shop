import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, Modal, ModalProps } from "react-bootstrap"
import { useCheckNumberPinMutation } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"

const CheckPhoneModal: FC<ModalProps> = ({ show, onHide }) => {
    const [value, setValue] = useState('')
    const [check, { isLoading, isSuccess }] = useCheckNumberPinMutation()

    const handler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if ( !isNaN(parseInt(value)) ) {
            setValue(value)
        }
    }

    const hideHandler = () => {
        setValue('')
        if ( onHide ) {
            onHide()
        }
    }

    useEffect(() => {
        if ( isSuccess ) {
            setValue('')
            if ( onHide ) {
                onHide()
            }
        }
    }, [isSuccess, onHide])

    return (
		<Modal show={show} onHide={hideHandler}>
			<Modal.Body className="pb-6 px-5 bg-primary">
				<Modal.Header
					closeButton
					closeVariant="white"
					className="border-0"
				/>
				<div className="mb-4 text-center text-uppercase text-white">
					Последние 4 цифры номера входящего звонка
				</div>
				<div className="text-center mb-5 d-flex">
					<Form.Control
						value={value}
						onChange={handler}
						className="p-3 fs-3 text-center m-auto bg-primary text-white"
						style={{ maxWidth: "200px" }}
					/>
				</div>

				<ButtonComponent
					disabled={value.length !== 4}
					isLoading={isLoading}
					onClick={() => check(value)}
					variant="secondary"
				>
					OK
				</ButtonComponent>
			</Modal.Body>
		</Modal>
	)
}

export default CheckPhoneModal