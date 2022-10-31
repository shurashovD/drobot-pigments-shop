import { ChangeEvent, useEffect, useState } from "react"
import { Button, Col, Container, Fade, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../../application/account.service"
import { useProfileEditMutation } from "../../../application/profile.service"
import AvatarComponent from "../../../components/AvatarComponent"
import ButtonComponent from "../../../components/ButtonComponent"
import ClientStatus from "../components/ClientStatus"
import InputComponent from "../components/InputComponent"

const parsePhoneValue = (value?: string) => {
	if (!value) return ""
	return `+${value}`
}

const ProfileEditComponent = () => {
	const navigate = useNavigate()
	const [initials, setInitials] = useState('')
	const { data: auth, refetch } = useAccountAuthQuery(undefined)
    const [state, setState] = useState({ name: auth?.name || '', mail: auth?.mail || '', phone: parsePhoneValue(auth?.tel) })
	const [action, { isLoading, isSuccess }] = useProfileEditMutation()
	const [invalidMail, setInvalidMail] = useState(false)

	const handler = () => {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
		if (!reg.test(state.mail)) {
			setInvalidMail(true)
			return
		}
		action({ email: state.mail, name: state.name })
	}

	const mailHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setInvalidMail(false)
		setState((state) => ({ ...state, mail: event.target.value }))
	}

	useEffect(() => {
		if (isSuccess) {
			refetch()
		}
	}, [isSuccess, refetch])

	useEffect(() => {
		if ( auth && auth.name ) {
			const nameArr = auth.name.split(' ')
			setInitials(`${nameArr[0][0]}${nameArr[1]?.[0] || ""}`.toUpperCase())
		}
	}, [auth])
    
    return (
		<Container fluid className="px-0 m-0">
			<Container className="px-2">
				<div className="text-uppercase text-dark">Личные данные</div>
			</Container>
			<hr className="bg-dark" />
			<Container className="px-2 mb-5">
				<Row className="justify-content-center mb-5">
					<Col xs={4}>
						<AvatarComponent alt={initials} />
					</Col>
				</Row>
				<InputComponent
					invalid={state.name.length === 0}
					value={state.name}
					handler={(e: ChangeEvent<HTMLInputElement>) =>
						setState((state) => ({
							...state,
							name: e.target.value,
						}))
					}
					placeholder="ИМЯ, ФАМИЛИЯ"
					title="Введите имя"
				/>
				<hr
					style={{
						backgroundColor: "#AB9A9A",
						opacity: "0.2 !important",
					}}
				/>
				<InputComponent invalid={false} value={state.phone} disabled={true} label="Телефон" />
				<hr
					style={{
						backgroundColor: "#AB9A9A",
						opacity: "0.2 !important",
					}}
				/>
				<InputComponent
					label="E-mail"
					invalid={state.mail === "" || invalidMail}
					value={state.mail}
					handler={mailHandler}
					title={invalidMail ? "Неверный формат" : "Введите почту"}
				/>
				<div className="mt-5 mb-3">
					<ButtonComponent disabled={state.name.length === 0 && state.mail.length === 0} isLoading={isLoading} onClick={handler}>
						Сохранить
					</ButtonComponent>
				</div>
				<Fade in={!!auth?.counterpartyId}>
					<div className="text-center">
						<Button variant="link" className="text-muted" onClick={() => navigate(-1)} disabled={!auth?.counterpartyId}>
							Назад
						</Button>
					</div>
				</Fade>
			</Container>
			<Container className="px-2">
				<div className="text-uppercase text-dark">Статус покупателя</div>
			</Container>
			<hr className="bg-dark mb-5" />
			<ClientStatus />
		</Container>
	)
}

export default ProfileEditComponent