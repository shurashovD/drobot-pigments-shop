import { ChangeEvent, FC, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { ISdekCreateWebhookPayload } from "../../../../shared"
import { useCreateHookMutation } from "../../../application/sdek.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    disabled?: boolean
}

const Footer: FC<IProps> = ({ disabled }) => {
    const baseUrl = useRef("https://drobot-pigments-shop/api/sdek/handle")
    const [create, { isLoading }] = useCreateHookMutation()
    const [state, setState] = useState<ISdekCreateWebhookPayload>({
		type: "ORDER_STATUS",
		url: baseUrl.current,
	})

    const typeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value
        if (type === "ORDER_STATUS") {
			setState((state) => ({ ...state, type: "ORDER_STATUS" }))
		}
        if (type === "PRINT_FORM") {
			setState((state) => ({ ...state, type: "PRINT_FORM" }))
		}
        if (type === "DOWNLOAD_PHOTO") {
			setState((state) => ({ ...state, type: "DOWNLOAD_PHOTO" }))
		}
    }

    const urlHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if ( event.target.value.length <= baseUrl.current.length ) {
            setState((state) => ({
				...state,
				url: baseUrl.current,
			}))
        }
        else {
            setState((state) => ({
				...state,
				url: event.target.value,
			}))
        }
    }

    return (
		<tr>
			<td>
				<Form.Select onChange={typeHandler} value={state.type} disabled={disabled}>
					<option value="ORDER_STATUS">Заказ</option>
					<option value="PRINT_FORM">Форма</option>
					<option value="DOWNLOAD_PHOTO">Фото</option>
				</Form.Select>
			</td>
			<td>
				<Form.Control value={state.url} onChange={urlHandler} />
			</td>
			<td>
				<ButtonComponent
					disabled={state.url.length <= baseUrl.current.length || disabled}
					isLoading={isLoading}
					onClick={() => create(state)}
				>
					Сохранить
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Footer