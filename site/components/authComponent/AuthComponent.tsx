import { FC, useEffect } from "react"
import { Modal, ModalProps, Tab } from "react-bootstrap"
import { useAccountAuthQuery } from "../../application/account.service"
import { setShow } from "../../application/authComponentSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import CheckPin from "./CheckPin"
import PassComponent from "./PassComponent"
import PhoneComponent from "./PhoneComponent"

const AuthComponent: FC<ModalProps> = () => {
	const { activeKey, show } = useAppSelector(state => state.authComponentSlice)
	const { data } = useAccountAuthQuery(undefined)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!!data) {
			dispatch(setShow(false))
		}
	}, [data, dispatch, setShow])

    return (
		<Modal show={show} onHide={() => dispatch(setShow(false))}>
			<Modal.Body className="bg-primary p-5">
				<Modal.Header closeButton closeVariant="white" className="border-0" />
				<Tab.Container activeKey={activeKey}>
					<Tab.Content>
						<Tab.Pane eventKey="phone">
							<PhoneComponent />
						</Tab.Pane>
						<Tab.Pane eventKey="pin">
							<CheckPin />
						</Tab.Pane>
						<Tab.Pane eventKey="pass">
							<PassComponent />
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</Modal.Body>
		</Modal>
	)
}

export default AuthComponent