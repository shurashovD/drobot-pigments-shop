import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Form, Modal, ModalProps } from "react-bootstrap"
import { useAccountAuthQuery, useCheckNumberMutation, useCheckPinMutation, useRegisterCheckPinMutation, useRegisterMutation } from "../application/account.service"
import { useAppDispatch, useAppSelector } from "../application/hooks"
import { setProfileClient, setShowAuthModal } from "../application/profileSlice"
import ButtonComponent from "./ButtonComponent"

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

const AuthComponent: FC<ModalProps> = () => {
    const [authorization, setAuthorization] = useState(true)
    const [checkPin, setCheckPin] = useState(false)
    const [phone, setPhone] = useState("")
    const [pin, setPin] = useState("")
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberMutation()
    const [checkCode, { isLoading: pinLoading, isSuccess: pinSuccess }] = useCheckPinMutation()
    const [registerCheckPin, { isLoading: registerPinLoading, isSuccess: registerPinSuccess }] = useRegisterCheckPinMutation()
    const [register, { isLoading: registerLoading, isSuccess: registerSuccess }] = useRegisterMutation()
	const {data: auth, isLoading: authLoading, isSuccess: authSuccess, refetch} = useAccountAuthQuery(undefined)
	const show = useAppSelector(state => state.profileSlice.showAuthModal)
	const dispatch = useAppDispatch()


    const codeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if ( !isNaN(Number(event.target.value)) && event.target.value.length <= 4 ) {
            setPin(event.target.value)
        }
    }

    const telHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPhone((state) => {
			const { value } = event.target
			const code = value.substring(4, 7)
			const first = value.substring(9, 12)
			const second = value.substring(13, 15)
			const fird = value.substring(16, 18)
			const str = code + first + second + fird
			let tel = state.length > str.length ? "" : str
			return tel
		})
    }

    const authToggle = () => {
        setCheckPin(false)
        setPin('')
        setAuthorization((state) => !state)
    }

    const hideHandler = () => {
        setAuthorization(true)
        setCheckPin(false)
        setPhone('')
        setPin('')
        dispatch(setShowAuthModal(false))
    }

    const clickHandler = () => {
        if ( authorization ) {
            if ( checkPin ) {
                checkCode({ pin })
            } else {
                checkNumber({ phone })
            }
        } else {
            if ( checkPin ) {
                registerCheckPin({ pin })
            } else {
                register({ phone })
            }
        }
    }

    useEffect(() => {
        if ( isSuccess || registerSuccess ) {
            setCheckPin(true)
        }
    }, [isSuccess, registerSuccess])

    useEffect(() => {
        if ( pinSuccess || registerPinSuccess ) {
            refetch()
        }
    }, [pinSuccess, registerPinSuccess, refetch])

	useEffect(() => {
		if (authSuccess && auth) {
			if (auth.name) {
				const [name, lastName] = auth.name.split(" ")
				const initials = `${name[0]}${
					lastName?.[0] || ""
				}`.toUpperCase()
				dispatch(
					setProfileClient({
						name: auth.name,
						mail: auth.mail,
						phone: auth.tel,
						initials,
						isCounterparty: !!auth.counterpartyId,
						status: auth.status
					})
				)
			} else {
				dispatch(
					setProfileClient({
						isCounterparty: !!auth.counterpartyId,
						phone: auth.tel,
					})
				)
			}
			dispatch(setShowAuthModal(false))
		}
	}, [dispatch, setShowAuthModal, setProfileClient, authSuccess, auth])

    return (
		<Modal show={show} onHide={hideHandler}>
			<Modal.Body className="bg-primary p-5">
				<Modal.Header
					closeButton
					closeVariant="white"
					className="border-0"
				/>
				{!checkPin && (
					<div className="text-white text-center text-uppercase mb-5">
						{authorization ? <>Войти</> : <>Зарегистрироваться</>}{" "}
						под номером телефона
					</div>
				)}
				{checkPin && (
					<div className="text-white text-center text-uppercase mb-4">
						Введите последние 4 цифры номера
					</div>
				)}
				{checkPin && (
					<div className="text-white text-center mb-4">
						Сейчас поступит входящий звонок на номер{" "}
						<span className="white-space">
							{parsePhoneValue(phone)}
						</span>{" "}
						<Button
							variant="link"
							className="m-0 p-0 text-secondary"
							onClick={() => setCheckPin(false)}
						>
							Изменить
						</Button>
					</div>
				)}
				{checkPin ? (
					<Form.Control
						value={pin}
						className="mb-4 p-2 py-4 text-white text-center"
						placeholder="4 цифры"
						onChange={codeHandler}
					/>
				) : (
					<Form.Control
						value={parsePhoneValue(phone)}
						className="mb-4 p-2 py-4 text-white"
						placeholder="Телефон"
						onChange={telHandler}
					/>
				)}
				{!checkPin && (
					<div className="text-white text-center mb-5">
						На указанный номер поступит звонок, отвечать на звонок
						не нужно.
					</div>
				)}
				<div className="text-center mb-4">
					<ButtonComponent
						variant="secondary"
						disabled={
							checkPin ? pin.length !== 4 : phone.length !== 10
						}
						isLoading={
							isLoading ||
							pinLoading ||
							registerPinLoading ||
							registerLoading ||
							authLoading
						}
						onClick={clickHandler}
					>
						{checkPin ? (
							<>Отправить</>
						) : authorization ? (
							<>Войти</>
						) : (
							<>Зарегистрироваться</>
						)}
					</ButtonComponent>
				</div>
				<div className="text-center">
					<Button
						variant="link"
						className="text-muted"
						size="sm"
						onClick={authToggle}
					>
						{authorization ? (
							<small>К регистрации</small>
						) : (
							<small>К авторизации</small>
						)}
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default AuthComponent