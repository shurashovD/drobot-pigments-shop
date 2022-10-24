import { ChangeEvent, FC, useEffect } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useAccountAuthQuery, useCheckPinMutation } from "../../application/account.service"
import { setCheckPin, setPin, setShow } from "../../application/authComponentSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import ButtonComponent from "../ButtonComponent"

interface IProps {
    show: boolean
}

const CheckPin: FC<IProps> = ({ show }) => {
    const { country, number, pin } = useAppSelector(state => state.authComponentSlice)
    const { data, isLoading: authLoading, isSuccess: authSuccess, refetch } = useAccountAuthQuery(undefined)
    const [check, { isLoading, isSuccess }] = useCheckPinMutation()
    const dispatch = useAppDispatch()
    const phone = () => {
        const codeEnd = 3
		const firstEnd = 6
		const secondEnd = 8
		const code = number.substring(0, codeEnd)
		const first = number.substring(codeEnd, firstEnd)
		const second = number.substring(firstEnd, secondEnd)
		const fird = number.substring(secondEnd)
		const value = `${code} ${first} ${second} ${fird}`
        return `+${country} ${value}`
    }

    const codeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if ( value.length > 4 ) return
        if ( !isNaN(+value) || value === '' ) {
            dispatch(setPin(value))
        }
    }

    useEffect(() => {
        dispatch(setPin(''))
    }, [dispatch, setPin, show])

    useEffect(() => {
        if ( isSuccess ) {
            refetch()
        }
    }, [isSuccess, refetch])

    useEffect(() => {
        if ( authSuccess && !!data?.status ) {
            dispatch(setShow(false))
        }
    }, [authSuccess, data, dispatch, setShow])

    if ( !show ) {
        return null
    }

    return (
		<Row>
			<Col xs={12} className="mb-4">
				<div className="text-white text-center text-uppercase">Введите последние 4 цифры номера</div>
			</Col>
			<Col xs={12} className="mb-4">
				<div className="text-white text-center">
					Сейчас поступит входящий звонок на номер <span className="white-space">{phone()}</span>{" "}
					<Button variant="link" className="m-0 p-0 text-secondary" onClick={() => dispatch(setCheckPin(false))}>
						Изменить
					</Button>
				</div>
			</Col>
			<Col xs={12} className="mb-4">
				<Form.Control value={pin} className="p-2 py-4 text-white text-center" placeholder="4 цифры" onChange={codeHandler} />
			</Col>
			<Col xs={12} className="text-center mb-4 fs-3">
				<ButtonComponent
					variant="secondary"
					disabled={pin.length !== 4}
					isLoading={isLoading || authLoading}
					onClick={() => check({ pin })}
				>
					OK
				</ButtonComponent>
			</Col>
		</Row>
	)
}

export default CheckPin