import { ChangeEvent, FC, useEffect, useState } from "react"
import { Col, Fade, Form, Image, Modal, ModalProps, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { clearCart } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useCreateOrderMutation } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
const logo = require("../../img/logo.png")

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

const SignOrderModal: FC<ModalProps> = ({ show, onHide }) => {
	const [state, setState] = useState({ tel: "", address: "" })
	const [final, setFinal] = useState(false)
	const products = useAppSelector((state) =>
		state.cartSlice.products.filter(({ checked }) => checked)
	)
	const [create, { data, isLoading, isSuccess, reset }] =
		useCreateOrderMutation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const telHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setState((state) => {
			const { value } = event.target
			const code = value.substring(4, 7)
			const first = value.substring(9, 12)
			const second = value.substring(13, 15)
			const fird = value.substring(16, 18)
			const str = code + first + second + fird
			let tel = state.tel.length > str.length ? "" : str
			return { ...state, tel }
		})
	}

	const kdHandler = (e: any) => {
		if (isNaN(e.key)) {
			e.preventDefault()
		}
		if (e.key === "Backspace") {
			setState((state) => ({ ...state, tel: "" }))
		}
	}

	const exitedHandler = () => {
		setState({ tel: "", address: "" })
		setFinal(false)
		if (isSuccess && data) {
			reset()
			navigate("/")
			dispatch(clearCart())
		}
	}

	return (
		<Modal centered show={show} onHide={onHide} onExited={exitedHandler}>
			<Modal.Header
				className="bg-primary border-0"
				closeButton
				closeVariant="white"
			>
				<Modal.Title className="text-secondary border-0">
					Оформление заказа
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="bg-primary px-5 py-6">
				<Fade
					in={final}
					mountOnEnter={true}
					unmountOnExit={true}
				>
					<div>
						<p className="text-center text-uppercase text-secondary">
							Ваш Заказ №{data}.
						</p>
						<div className="text-center my-5">
							<Image src={logo} width={106} />
						</div>
						<p className="text-center text-muted">
							В течении 15 минут с вами свяжется менеджер.
						</p>
					</div>
				</Fade>
				<Fade
					in={!data && !isSuccess}
					mountOnEnter={true}
					unmountOnExit={true}
					onExited={() => setFinal(true)}
				>
					<Row xs={1} className="mb-5 g-5">
						<Col>
							<Form.Label className="w-100">
								<span className="text-muted">Телефон*</span>
								<Form.Control
									name="tel"
									onChange={telHandler}
									onKeyDown={kdHandler}
									value={parsePhoneValue(state.tel)}
									className="w-100 p-3 py-2 border-secondary text-secondary bg-primary"
								/>
							</Form.Label>
						</Col>
						<Col>
							<Form.Label className="w-100">
								<span className="text-muted">
									Адрес доставки*
								</span>
								<Form.Control
									name="address"
									onChange={(
										e: ChangeEvent<HTMLInputElement>
									) =>
										setState((state) => ({
											...state,
											[e.target.name]: e.target.value,
										}))
									}
									value={state.address}
									className="w-100 p-3 py-2 border-secondary text-secondary bg-primary"
								/>
							</Form.Label>
						</Col>
						<Col xs={"auto"}>
							<ButtonComponent
								disabled={
									state.address === "" ||
									state.tel.length !== 10
								}
								className="border border-secondary"
								isLoading={isLoading}
								onClick={() =>
									create({
										...state,
										products: JSON.stringify(products),
									})
								}
							>
								<span>Оформить заказ</span>
							</ButtonComponent>
						</Col>
					</Row>
				</Fade>
			</Modal.Body>
		</Modal>
	)
}

export default SignOrderModal
