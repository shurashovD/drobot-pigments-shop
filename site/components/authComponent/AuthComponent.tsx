import { FC } from "react"
import { Button, Modal, ModalProps } from "react-bootstrap"
import { setAuthorization, setShow } from "../../application/authComponentSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import CheckPin from "./CheckPin"
import PhoneComponent from "./PhoneComponent"

const AuthComponent: FC<ModalProps> = () => {
	const { authorization, checkPin, show } = useAppSelector(state => state.authComponentSlice)
	const dispatch = useAppDispatch()

    return (
		<Modal show={show} onHide={() => dispatch(setShow(false))}>
			<Modal.Body className="bg-primary p-5">
				<Modal.Header closeButton closeVariant="white" className="border-0" />
				<PhoneComponent show={!checkPin} />
				<CheckPin show={checkPin} />
				<div className="text-center">
					<Button variant="link" className="text-muted" size="sm" onClick={() => dispatch(setAuthorization(!authorization))}>
						{authorization ? <small>К регистрации</small> : <small>К авторизации</small>}
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default AuthComponent