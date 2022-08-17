import { ChangeEvent, FC, useEffect, useState } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { IAgentDiscount } from '../../../shared/index'
import { useCreateAgentLoyaltyMutation, useDeleteAgentLoyaltyMutation } from "../../application/loyalty.service"
import ButtonComponent from "../../components/ButtonComponent"

interface IProps {
	disabled: boolean
    percentValue?: string
}

const AgentLoyaltyItem: FC<IProps> = ({ disabled, percentValue }) => {
    const [state, setState] = useState({ percentValue: percentValue || '' })
    const [update, { isLoading }] = useCreateAgentLoyaltyMutation()
    const [remove, { isLoading: removeLoading }] = useDeleteAgentLoyaltyMutation()

    const handler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "" && !isNaN(+e.target.value)) {
			setState((state) => ({ ...state, [e.target.name]: e.target.value }))
		}
		if (e.target.value === "") {
			setState((state) => ({ ...state, [e.target.name]: e.target.value }))
		}
	}

    useEffect(() => {
        setState({ percentValue: percentValue || '' })
    }, [percentValue])

    return (
		<Row>
			<Col xs={8}>
                <Form.Control
                    value={state.percentValue}
                    disabled={disabled}
                    name="percentValue"
                    onChange={handler}
                    className="rounded-0 border-0 border-bottom"
                />
			</Col>
			<Col className="d-flex justify-content-center align-items-end" xs={4}>
                {state.percentValue === percentValue ? (
                    <ButtonComponent
                        disabled={disabled}
                        isLoading={removeLoading}
                        variant="link"
                        className="text-danger"
                        onClick={() => remove(undefined)}
                    >
                        <small>Удалить</small>
                    </ButtonComponent>
                ) : (
                    <ButtonComponent
                        disabled={disabled || state.percentValue === ""}
                        isLoading={isLoading}
                        onClick={() =>
                            update({ percentValue: parseInt(state.percentValue) })
                        }
                    >
                        <small>Ок</small>
                    </ButtonComponent>
                )}
			</Col>
		</Row>
	)
}

export default AgentLoyaltyItem