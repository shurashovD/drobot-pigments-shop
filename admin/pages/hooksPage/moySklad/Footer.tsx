import { ChangeEvent, FC, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { IMSHook } from "../../../../shared"
import { useCreateHookMutation } from "../../../application/moySklad.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    disabled?: boolean
}

const Footer: FC<IProps> = ({ disabled }) => {
    const baseUrl = useRef("https://drobot-pigments-shop.ru/api/moy-sklad/handle")
    const [create, { isLoading }] = useCreateHookMutation()
    const [state, setState] = useState<IMSHook>({
		action: "CREATE",
		entityType: "product",
		url: baseUrl.current,
	})

    const actionHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const action = event.target.value
        if ( action === 'CREATE' ) {
            setState(state => ({ ...state, action: 'CREATE' }))
        }
        if ( action === 'UPDATE' ) {
            setState(state => ({ ...state, action: 'UPDATE' }))
        }
        if ( action === 'DELETE' ) {
            setState((state) => ({ ...state, action: "DELETE" }))
        }
    }

    const entityHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const entityType = event.target.value
        if ( entityType === 'productfolder' ) {
            setState(state => ({ ...state, entityType: 'productfolder' }))
        }
        if ( entityType === 'product' ) {
            setState(state => ({ ...state, entityType: 'product' }))
        }
        if ( entityType === 'variant' ) {
            setState((state) => ({ ...state, entityType: "variant" }))
        }
		if (entityType === "customerorder") {
			setState((state) => ({ ...state, entityType: "customerorder" }))
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
				<Form.Select onChange={actionHandler} value={state.action} disabled={disabled}>
					<option value="CREATE">Создание</option>
					<option value="DELETE">Удаление</option>
					<option value="UPDATE">Изменение</option>
				</Form.Select>
			</td>
			<td>
				<Form.Select onChange={entityHandler} value={state.entityType} disabled={disabled}>
					<option value="productfolder">Группа товаров</option>
					<option value="product">Товар</option>
					<option value="variant">Модификация</option>
					<option value="customerorder">Заказ покупателя</option>
				</Form.Select>
			</td>
			<td>
				<Form.Control value={state.url} onChange={urlHandler} />
			</td>
			<td>
				<ButtonComponent
					disabled={state.url.length <= baseUrl.current.length || disabled}
					isLoading={isLoading}
					onClick={() => create({ payload: state })}
				>
					Сохранить
				</ButtonComponent>
			</td>
			<td></td>
		</tr>
	)
}

export default Footer