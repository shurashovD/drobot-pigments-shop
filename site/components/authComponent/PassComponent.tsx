import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Col, Fade, Form, Row } from 'react-bootstrap'
import { useAccountAuthQuery, useCheckPassMutation, useRegisterInsertPassMutation } from '../../application/account.service'
import { setDoublePass, setInsertPin, setPass } from '../../application/authComponentSlice'
import { useAppDispatch, useAppSelector } from '../../application/hooks'
import ButtonComponent from '../ButtonComponent'
import ym from 'react-yandex-metrika'

const PassComponent = () => {
    const { isFetching } = useAccountAuthQuery(undefined)
    const { authorization, pass, doublePass } = useAppSelector(state => state.authComponentSlice)
    const [checkPass, { isLoading }] = useCheckPassMutation()
    const [insertPass, { isLoading: insertLoading, isSuccess }] = useRegisterInsertPassMutation()
    const [error, setError] = useState<string|undefined>()
    const dispatch = useAppDispatch()

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setError(undefined)
        if ( name === 'pass' ) {
            dispatch(setPass(value))
        }
        if (name === "doublePass") {
			dispatch(setDoublePass(value))
		}
    }

    const clickHandler = () => {
        if ( pass.length === 0 ) {
            setError('Введите пароль')
            return
        }

        if (!authorization && pass !== doublePass) {
			setError("Пароли не совпадают")
			return
		}

        if ( authorization ) {
            checkPass({ pass })
        } else {
            insertPass({ pass })
        }
    }

	useEffect(() => {
		if (isSuccess) {
			ym('reachGoal','register-success')
		}
		ym('reachGoal','register-success')
	}, [isSuccess])		// eslint-disable-line

    return (
		<Row>
			<Col xs={12} className="mb-4">
				<Form.Label className="w-100">
					<div className="mb-1 text-secondary">Введите пароль</div>
					<Form.Control type="password" value={pass} className="p-2 py-4 text-white" onChange={changeHandler} name="pass" />
				</Form.Label>
			</Col>
			{!authorization && <Col xs={12} className="mb-1">
				<Form.Label className="w-100">
					<div className="mb-2 text-secondary">Введите пароль еще раз</div>
					<Form.Control type="password" value={doublePass} className="p-2 py-4 text-white" onChange={changeHandler} name="doublePass" />
				</Form.Label>
			</Col>}
			<Col xs={12} className="text-center mb-4">
				<Fade in={!!error}>
					<div className="text-danger mb-1">{error}</div>
				</Fade>
				<ButtonComponent variant="secondary" isLoading={isLoading || insertLoading || isFetching} onClick={clickHandler}>
					OK
				</ButtonComponent>
			</Col>
			<Col xs={12} className="text-center">
				<Button variant="link" className="text-secondary" onClick={() => dispatch(setInsertPin())}>
					Звонок дошёл
				</Button>
			</Col>
		</Row>
	)
}

export default PassComponent