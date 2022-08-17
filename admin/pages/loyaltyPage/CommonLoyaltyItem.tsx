import { ChangeEvent, FC, useEffect, useState } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { ICommonDiscount } from '../../../shared/index'
import { useDeleteCommonLoyaltyMutation, useUpdateCommonLoyaltyMutation } from "../../application/loyalty.service"
import ButtonComponent from "../../components/ButtonComponent"

interface IProps extends ICommonDiscount {
	disabled: boolean
}

const CommonLoyaltyItem: FC<IProps> = ({ id, disabled, lowerTreshold, percentValue }) => {
    const [state, setState] = useState({ lowerTreshold: lowerTreshold.toString(), percentValue: percentValue.toString() })
    const [update, { isLoading }] = useUpdateCommonLoyaltyMutation()
    const [remove, { isLoading: removeLoading }] = useDeleteCommonLoyaltyMutation()

    const handler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "" && !isNaN(+e.target.value)) {
			setState((state) => ({ ...state, [e.target.name]: e.target.value }))
		}
		if (e.target.value === "") {
			setState((state) => ({ ...state, [e.target.name]: e.target.value }))
		}
	}

    useEffect(() => {
        setState({ lowerTreshold: lowerTreshold.toString(), percentValue: percentValue.toString() })
    }, [lowerTreshold, percentValue])

    return (
		<Row>
			<Col xs={6}>
                <Form.Control
                    value={state.lowerTreshold}
                    disabled={disabled}
                    name="lowerTreshold"
                    onChange={handler}
                    className="rounded-0 border-0 border-bottom"
                />
			</Col>
			<Col xs={4}>
                <Form.Control
                    value={state.percentValue}
                    disabled={disabled}
                    name="percentValue"
                    onChange={handler}
                    className="rounded-0 border-0 border-bottom"
                />
			</Col>
			<Col className="d-flex justify-content-center align-items-end" xs={2}>
                {state.lowerTreshold === lowerTreshold.toString() && state.percentValue === percentValue.toString() ? (
                    <ButtonComponent
                        disabled={disabled}
                        isLoading={removeLoading}
                        variant="link"
                        className="text-danger"
                        onClick={() => remove({ id })}
                    >
                        <small>Удалить</small>
                    </ButtonComponent>
                ) : (
                    <ButtonComponent
                        disabled={disabled || state.lowerTreshold === "" || state.percentValue === ""}
                        isLoading={isLoading}
                        onClick={() =>
                            update({ body: { lowerTreshold: parseInt(state.lowerTreshold), percentValue: parseInt(state.percentValue) }, id })
                        }
                    >
                        <small>Ок</small>
                    </ButtonComponent>
                )}
			</Col>
		</Row>
	)
}

export default CommonLoyaltyItem