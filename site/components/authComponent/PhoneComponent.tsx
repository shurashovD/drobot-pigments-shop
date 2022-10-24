import classNames from "classnames"
import { ChangeEvent, FC, KeyboardEventHandler, useEffect, useState } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useCheckNumberMutation, useRegisterMutation } from "../../application/account.service"
import { setCheckPin, setCountry, setNumber } from "../../application/authComponentSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import ButtonComponent from "../ButtonComponent"

interface IProps {
    show: boolean
}

const PhoneComponent: FC<IProps> = ({ show }) => {
    const { authorization, country, number } = useAppSelector(state => state.authComponentSlice)
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberMutation()
	const [register, { isLoading: registerLoading, isSuccess: registerSuccess }] = useRegisterMutation()
    const dispatch = useAppDispatch()
    const [value, setValue] = useState("")
	const [codeInvalid, setCodeInvalid] = useState(false)
	const [numberInvalid, setNumberInvalid] = useState(false)

    const codeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.substring(1)
        if ( value === '' || !isNaN(+value) ) {
            dispatch(setCountry(value))
			setCodeInvalid(false)
        }
    }

    const kdHandler: KeyboardEventHandler = (event) => {
        const { key } = event
        if ( key === 'Backspace' ) {
            dispatch(setNumber(""))
        }
        if ( isNaN(+key) ) {
            event.preventDefault()
        }
    }

    const phoneHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
		if ( number.length === 10 ) {
			return
		}
        const numberValue = value.split("").filter(item => item !== " ").join("")
        dispatch(setNumber(numberValue))
		setNumberInvalid(false)
    }

    const clickHandler = () => {
		if ( country.length === 0 ) {
			setCodeInvalid(true)
			return
		}
		if ( number.length !== 10 ) {
			setNumberInvalid(true)
			return
		}
		const phone = country + number
		if (authorization) {
			checkNumber({ phone })
		} else {
			register({ phone })
		}
	}

    useEffect(() => {
        const codeEnd = 3
        const firstEnd = 6
        const secondEnd = 8
        const code = number.substring(0, codeEnd)
        const first = number.substring(codeEnd, firstEnd)
        const second = number.substring(firstEnd, secondEnd)
        const fird = number.substring(secondEnd)
		let value = code
		if ( first.length > 0 ) {
			value += ' ' + first
		}
		if ( second.length > 0 ) {
			value += ' ' + second
		}
		if ( fird.length > 0 ) {
			value += ' ' + fird
		}
        setValue(value)
    }, [number])

	useEffect(() => {
		if (isSuccess || registerSuccess) {
			dispatch(setCheckPin(true))
		}
	}, [dispatch, isSuccess, registerSuccess, setCheckPin])

    if (!show) {
		return null
	}

    return (
		<Row>
			<Col xs={12} className="mb-5">
				<div className="text-white text-center text-uppercase">
					{authorization ? <>Войти</> : <>Зарегистрироваться</>} под номером телефона
				</div>
			</Col>
			<Col xs={3}>
				<Form.Group>
					<Form.Label>
						<small className={classNames({ "text-muted": !codeInvalid, "text-danger": codeInvalid })}>Код</small>
					</Form.Label>
					<Form.Control value={`+${country}`} onChange={codeHandler} placeholder="+7" className="p-2 py-4 text-white text-center" />
				</Form.Group>
			</Col>
			<Col xs={9}>
				<Form.Group>
					<Form.Label>
						<small className={classNames({ "text-muted": !numberInvalid, "text-danger": numberInvalid })}>Номер</small>
					</Form.Label>
					<Form.Control
						value={value}
						onChange={phoneHandler}
						onKeyDown={kdHandler}
						placeholder="123 45 67"
						className="p-2 py-4 text-white"
					/>
				</Form.Group>
			</Col>
			<Col xs={12} className="mt-4">
				<div className="text-white text-center mb-5">На указанный номер поступит звонок, отвечать на звонок не нужно.</div>
			</Col>
			<Col xs={12} className="text-center mb-4">
				<ButtonComponent
					variant="secondary"
					isLoading={isLoading || registerLoading}
					onClick={clickHandler}
				>
					{authorization ? <>Войти</> : <>Зарегистрироваться</>}
				</ButtonComponent>
			</Col>
			<Col xs={12} className="mb-5">
				<Row className="text-white justify-content-center g-2">
					<Col xs="auto" className="d-flex align-items-center">
						<input type="checkbox" checked={true} className="bg-dark" readOnly />
					</Col>
					<Col xs={8}>
						Принимаю условия{" "}
						<NavLink to="/privacy-policy" className="text-white text-decoration-underline">
							соглашения о конфиденциальности
						</NavLink>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}

export default PhoneComponent