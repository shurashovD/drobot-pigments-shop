import { ChangeEvent, FC, useEffect, useState } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { useCreateCommonLoyaltyMutation } from "../../application/loyalty.service"
import ButtonComponent from "../../components/ButtonComponent"

interface IProps {
	disabled: boolean
}

const CommonLoyaltyCreate: FC<IProps> = ({ disabled }) => {
    const [state, setState] = useState({ lowerTreshold: '', percentValue: '' })
	const [create, { isLoading, isSuccess }] = useCreateCommonLoyaltyMutation()

    const handler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== "" && !isNaN(+e.target.value)) {
			setState((state) => ({ ...state, [e.target.name]: e.target.value }))
		}
		if ( e.target.value === '' ) {
			setState((state) => ({ ...state, [e.target.name]: e.target.value }))
		}
    }

	useEffect(() => {
		if ( isSuccess ) {
			setState({ lowerTreshold: "", percentValue: "" })
		}
	}, [isSuccess])

    return (
		<Row>
			<Col xs={6}>
				<Form.Control value={state.lowerTreshold} disabled={disabled} name="lowerTreshold" onChange={handler} className="rounded-0 border-0 border-bottom" />	
			</Col>
			<Col xs={4}>
				<Form.Control value={state.percentValue} disabled={disabled} name="percentValue" onChange={handler} className="rounded-0 border-0 border-bottom" />
			</Col>
			<Col xs={2} className="d-flex justify-content-center align-items-end">
				<ButtonComponent
					disabled={disabled || state.lowerTreshold === "" || state.percentValue === ""}
					isLoading={isLoading}
					onClick={() => create({ lowerTreshold: parseInt(state.lowerTreshold), percentValue: parseInt(state.percentValue) })}
				>
					<small>Ок</small>
				</ButtonComponent>
			</Col>
		</Row>
	)
}

export default CommonLoyaltyCreate