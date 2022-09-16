import { ChangeEvent, useEffect, useState } from "react"
import { Col, Container, Row, Stack } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"
import { useProfileEditMutation } from "../../../application/profile.service"
import AvatarComponent from "../../../components/AvatarComponent"
import ButtonComponent from "../../../components/ButtonComponent"
import ClientStatus from "../components/ClientStatus"
import InputComponent from "../components/InputComponent"
import SuccessAlert from "./SuccessAlert"
import WarningAlert from "./WarningAlert"

const parsePhoneValue = (value?: string) => {
	if ( !value ) return ''
	const code = value.substring(0, 3)
	const fird = value.substring(8, 10)
	return `+7 (${code}) ***-**-${fird}`
}

const Profile = () => {
	const [initials, setInitials] = useState("")
	const { data: auth, refetch } = useAccountAuthQuery(undefined)
	const [state, setState] = useState({ name: auth?.name || "", mail: auth?.mail || "", phone: parsePhoneValue(auth?.tel) })
	const [action, { isLoading, isSuccess }] = useProfileEditMutation()

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
			<Row className="mb-6">
				<Col xs={7}>
					<Row>
						<Col
							xs={10}
							className="offset-2 border-bottom border-dark pb-2 mb-6"
						>
							<span className="text-uppercase">
								Личные данные
							</span>
						</Col>
					</Row>
					<Row className="mb-5">
						<Col xs={2}>
							<AvatarComponent alt={initials} />
						</Col>
						<Col
							xs={10}
							className="border-bottom border-gray d-flex align-items-center"
						>
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
						<Col
							xs={10}
							className="offset-2 border-bottom border-gray pb-4"
						>
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
						<Col
							xs={10}
							className="offset-2 border-bottom border-gray pb-4"
						>
							<InputComponent
								label="E-mail"
								invalid={state.mail === ""}
								value={state.mail}
								handler={(e: ChangeEvent<HTMLInputElement>) =>
									setState((state) => ({
										...state,
										mail: e.target.value,
									}))
								}
								title="Введите почту"
							/>
						</Col>
					</Row>
					<ButtonComponent
						disabled={state.name.length * state.phone.length * state.mail.length === 0}
						isLoading={isLoading}
						onClick={() => action({ name: state.name, email: state.mail })}
					>
						Сохранить
					</ButtonComponent>
				</Col>
				<Col xs={5}>
					<Stack gap={3}>
						<SuccessAlert />
						<WarningAlert />
					</Stack>
				</Col>
			</Row>
			<Row>
				<Col xs={7}>
					<Row className="mb-5">
						<Col
							xs={10}
							className="offset-2 border-bottom border-dark pb-2"
						>
							<span className="text-uppercase">
								Статус покупателя
							</span>
						</Col>
					</Row>
					<ClientStatus />
				</Col>
			</Row>
		</Container>
	)
}

export default Profile