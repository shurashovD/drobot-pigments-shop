import { ChangeEvent, useEffect, useState } from "react"
import { Button, Col, Container, Fade, Row, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../../application/account.service"
import { useProfileEditMutation } from "../../../application/profile.service"
import AvatarComponent from "../../../components/AvatarComponent"
import ButtonComponent from "../../../components/ButtonComponent"
import ClientStatus from "../components/ClientStatus"
import InputComponent from "../components/InputComponent"
import SaveAlert from "./SaveAlert"
import SuccessAlert from "./SuccessAlert"
import WarningAlert from "./WarningAlert"

const parsePhoneValue = (value?: string) => {
	if (!value) return ""
	const country = value.substring(0, value.length - 10)
	const number = value.substring(value.length - 10)
	const code = number.substring(0, 3)
	const first = number.substring(3, 6)
	const second = number.substring(6, 8)
	const fird = number.substring(8, 10)
	return `+${country} (${code}) ${first}-${second}-${fird}`
}

const Profile = () => {
	const [initials, setInitials] = useState("")
	const { data: auth, refetch } = useAccountAuthQuery(undefined)
	const [state, setState] = useState({ name: auth?.name || "", mail: auth?.mail || "", phone: parsePhoneValue(auth?.tel) })
	const [action, { isLoading, isSuccess }] = useProfileEditMutation()
	const [invalidMail, setInvalidMail] = useState(false)
	const navigate = useNavigate()

	const handler = () => {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
		if ( !reg.test(state.mail) ) {
			setInvalidMail(true)
			return
		}
		action({ email: state.mail, name: state.name })
	}

	const mailHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setInvalidMail(false)
		setState(state => ({ ...state, mail: event.target.value }))
	}

	useEffect(() => {
		if (isSuccess) {
			refetch()
		}
	}, [isSuccess, refetch])

	useEffect(() => {
		if (auth && auth.name) {
			const nameArr = auth.name.split(" ")
			setInitials(`${nameArr[0][0]}${nameArr[1]?.[0] || ""}`.toUpperCase())
		}
	}, [auth])

	return (
		<Container className="pt-6">
			<Row className="mb-5">
				<Col xs={7}>
					<Row>
						<Col xs={10} className="offset-2 border-bottom border-dark pb-2 mb-6">
							<span className="text-uppercase">Личные данные</span>
						</Col>
					</Row>
					<Row className="mb-5">
						<Col xs={2}>
							<AvatarComponent alt={initials} />
						</Col>
						<Col xs={10} className="border-bottom border-gray d-flex align-items-center">
							<InputComponent
								value={state.name}
								invalid={state.name === ""}
								handler={(e: ChangeEvent<HTMLInputElement>) =>
									setState((state) => ({
										...state,
										name: e.target.value,
									}))
								}
								title="Введите имя и фамилию"
							/>
						</Col>
					</Row>
					<Row className="mb-5">
						<Col xs={10} className="offset-2 border-bottom border-gray pb-4">
							<InputComponent
								disabled={true}
								invalid={state.phone === ""}
								label="Телефон"
								value={state.phone}
								handler={(e: ChangeEvent<HTMLInputElement>) =>
									setState((state) => ({
										...state,
										name: e.target.value,
									}))
								}
							/>
						</Col>
					</Row>
					<Row className="mb-5">
						<Col xs={10} className="offset-2 border-bottom border-gray pb-4">
							<InputComponent
								label="E-mail"
								invalid={state.mail === "" || invalidMail}
								value={state.mail}
								handler={mailHandler}
								title={invalidMail ? "Неверный формат" : "Введите почту"}
							/>
						</Col>
					</Row>
					<ButtonComponent
						disabled={state.name.length * state.phone.length * state.mail.length === 0}
						isLoading={isLoading}
						onClick={handler}
					>
						Сохранить
					</ButtonComponent>
					<Fade in={!!auth?.counterpartyId}>
						<div className="text-center">
							<Button variant="link" onClick={() => navigate({ hash: "#main" })}>
								В личный кабинет
							</Button>
						</div>
					</Fade>
				</Col>
				<Col xs={5}>
					<Stack gap={3} className="sticky-top" style={{ top: "120px" }}>
						<SuccessAlert />
						<WarningAlert />
						<SaveAlert />
					</Stack>
				</Col>
			</Row>
			<Row>
				<Col xs={7}>
					<Row className="gy-5">
						<Col xs={10} className="offset-2 border-bottom border-dark pb-2">
							<span className="text-uppercase">Статус покупателя</span>
						</Col>
						<Col xs={10} className="offset-2">
							<ClientStatus />
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	)
}

export default Profile