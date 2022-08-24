import { ChangeEvent, useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../../application/account.service"
import { useProfileEditMutation } from "../../../application/profile.service"
import AvatarComponent from "../../../components/AvatarComponent"
import ButtonComponent from "../../../components/ButtonComponent"
import ClientStatus from "../components/ClientStatus"
import InputComponent from "../components/InputComponent"

const parsePhoneValue = (value?: string) => {
	if (!value) return ""
	const code = value.substring(0, 3)
	const fird = value.substring(8, 10)
	return `+7 (${code}) ***-**-${fird}`
}

const ProfileEditComponent = () => {
	const navigate = useNavigate()
	const [initials, setInitials] = useState('')
	const { data: auth, refetch } = useAccountAuthQuery(undefined)
    const [state, setState] = useState({ name: auth?.name || '', mail: auth?.mail || '', phone: parsePhoneValue(auth?.tel) })
	const [action, { isLoading, isSuccess }] = useProfileEditMutation()

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
			<Container className="px-2 mb-6">
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
				/>
				<hr
					style={{
						backgroundColor: "#AB9A9A",
						opacity: "0.2 !important",
					}}
				/>
				<InputComponent invalid={state.name.length === 0} value={state.phone} disabled={true} label="Телефон" />
				<hr
					style={{
						backgroundColor: "#AB9A9A",
						opacity: "0.2 !important",
					}}
				/>
				<InputComponent
					invalid={state.name.length === 0}
					value={state.mail}
					handler={(e: ChangeEvent<HTMLInputElement>) =>
						setState((state) => ({
							...state,
							name: e.target.value,
						}))
					}
					label="Почта"
				/>
				<div className="mt-5 mb-3">
					<ButtonComponent
						disabled={state.name.length === 0 && state.mail.length === 0}
						isLoading={isLoading}
						onClick={() => action({ email: state.mail, name: state.name })}
					>
						Сохранить
					</ButtonComponent>
				</div>
				<div className="text-center">
					{auth && !!auth.counterpartyId && (
						<Button variant="link" className="text-muted" onClick={() => navigate(-1)}>
							Назад
						</Button>
					)}
				</div>
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