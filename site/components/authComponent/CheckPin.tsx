import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useAccountAuthQuery, useCheckPinMutation, useRegisterCheckPinMutation } from "../../application/account.service"
import { setInsertPass, setInsertPhone, setPin } from "../../application/authComponentSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import ButtonComponent from "../ButtonComponent"

const CheckPin = () => {
    const { activeKey, authorization, number, pin } = useAppSelector(state => state.authComponentSlice)
    const { isFetching: authLoading } = useAccountAuthQuery(undefined)
    const [check, { isLoading }] = useCheckPinMutation()
	const [registerCheck, { isLoading: registerLoading }] = useRegisterCheckPinMutation()
    const dispatch = useAppDispatch()

    const codeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if ( value.length > 4 ) return
        if ( !isNaN(+value) || value === '' ) {
            dispatch(setPin(value))
        }
    }

    return (
		<Row className="gy-4">
			<Col xs={12}>
				<div className="text-white text-center text-uppercase">Введите последние 4 цифры номера</div>
			</Col>
			<Col xs={12}>
				<div className="text-white text-center">
					Сейчас поступит входящий звонок на номер <span className="white-space">{`+${number}`}</span>{" "}
					<Button variant="link" className="m-0 p-0 text-secondary" onClick={() => dispatch(setInsertPhone())}>
						Изменить
					</Button>
				</div>
			</Col>
			<Col xs={12}>
				<Form.Control value={pin} className="p-2 py-4 text-white text-center fs-3" placeholder="4 цифры" onChange={codeHandler} />
			</Col>
			<Col xs={12} className="text-center fs-3">
				<ButtonComponent
					variant="secondary"
					disabled={pin.length !== 4}
					isLoading={isLoading || authLoading || registerLoading}
					onClick={() => (authorization ? check({ pin }) : registerCheck({ pin }))}
				>
					OK
				</ButtonComponent>
			</Col>
			<Col xs={12} className="text-center">
				<Button variant="link" className="text-secondary" onClick={() => dispatch(setInsertPass())}>
					{authorization ? <>Войти</> : <>Зарегистрироваться</>} с паролем
				</Button>
			</Col>
		</Row>
	)
}

export default CheckPin