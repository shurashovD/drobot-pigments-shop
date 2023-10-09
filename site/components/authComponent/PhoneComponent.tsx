import classNames from "classnames"
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useCheckNumberMutation, useRegisterMutation } from "../../application/account.service"
import { setAuthorization, setInsertPass, setInsertPin, setNumber } from "../../application/authComponentSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import ButtonComponent from "../ButtonComponent"

const PhoneComponent = () => {
    const { authorization, number } = useAppSelector(state => state.authComponentSlice)
    const [checkNumber, { isLoading, isSuccess }] = useCheckNumberMutation()
	const [register, { isLoading: registerLoading, isSuccess: registerSuccess }] = useRegisterMutation()
    const dispatch = useAppDispatch()
    const [value, setValue] = useState("")
	const [numberInvalid, setNumberInvalid] = useState(false)

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
        dispatch(setNumber(event.target.value.substring(1)))
		setNumberInvalid(false)
    }

    const clickHandler = () => {
		if ( number.length < 10 ) {
			setNumberInvalid(true)
			return
		}
		const phone = number
		if (authorization) {
			checkNumber({ phone })
		} else {
			register({ phone })
		}
	}

    useEffect(() => {
        setValue(`+${number}`)
    }, [number])

	useEffect(() => {
		if (isSuccess || registerSuccess) {
			dispatch(setInsertPass())
		}
	}, [dispatch, isSuccess, registerSuccess, setInsertPin])

    return (
		<Row>
			<Col xs={12} className="mb-5">
				<div className="text-white text-center text-uppercase">
					{authorization ? <>Войти</> : <>Зарегистрироваться</>} под номером телефона
				</div>
			</Col>
			<Col xs={12}>
				<Form.Group>
					<Form.Label>
						<small className={classNames({ "text-muted": !numberInvalid, "text-danger": numberInvalid })}>Номер</small>
					</Form.Label>
					<Form.Control value={value} onChange={phoneHandler} onKeyDown={kdHandler} className="p-2 py-4 text-white" />
				</Form.Group>
			</Col>
			<Col xs={12} className="mt-4 mb-5">
				<div className="text-white text-center">На указанный номер поступит звонок, отвечать на звонок не нужно.</div>
			</Col>
			<Col xs={12} className="text-center mb-4">
				<ButtonComponent variant="secondary" isLoading={isLoading || registerLoading} onClick={clickHandler}>
					{authorization ? <>Войти</> : <>Зарегистрироваться</>}
				</ButtonComponent>
			</Col>
			<Col xs={12} className="text-center mb-4">
				<Button variant="link" className="text-muted" size="sm" onClick={() => dispatch(setAuthorization(!authorization))}>
					{authorization ? <small>К регистрации</small> : <small>К авторизации</small>}
				</Button>
			</Col>
			<Col xs={12}>
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