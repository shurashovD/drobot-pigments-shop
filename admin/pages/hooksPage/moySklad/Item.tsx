import { ChangeEvent, FC } from "react"
import { Form } from "react-bootstrap"
import { IMSHook } from "../../../../shared"
import { useDeleteHookMutation, useDisableHookMutation, useEnableHookMutation } from "../../../application/moySklad.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps extends IMSHook {
    disabled?: boolean
}

const Item: FC<IProps> = ({ action, url, entityType, enabled, id, disabled }) => {
	const [remove, { isLoading }] = useDeleteHookMutation()
    const [enable, {isLoading: enableLoading}] = useEnableHookMutation()
    const [disable, {isLoading: disableLoading}] = useDisableHookMutation()

    const handler = (event: ChangeEvent<HTMLInputElement>) => {
        if ( id ) {
            event.target.checked ? enable({ id }) : disable({ id })
        }
    }

	return (
		<tr className={`align-middle text-center ${!enabled && "text-muted"}`}>
			<td>
				{action === "CREATE" && <>Создание</>}
				{action === "DELETE" && <>Удаление</>}
				{action === "UPDATE" && <>Изменение</>}
			</td>
			<td>
				{entityType === "product" && <>Товар</>}
				{entityType === "productfolder" && <>Группа товаров</>}
				{entityType === "variant" && <>Модификация</>}
			</td>
			<td>{url}</td>
			<td>
				<Form.Check
					type="switch"
					checked={enabled}
					disabled={disabled || enableLoading || disableLoading}
					onChange={handler}
				/>
			</td>
			<td>
				<ButtonComponent
					variant="link"
					className="text-danger"
					isLoading={isLoading}
					onClick={() => (id ? remove({ id }) : {})}
					disabled={disabled || enableLoading || disableLoading}
				>
					Удалить
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Item