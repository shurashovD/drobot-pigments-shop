import { ChangeEvent, useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { successAlert } from "../../application/alertSlice"
import { useCreateCategoryMutation } from "../../application/category.service"
import { useAppDispatch } from "../../application/hooks"
import ButtonComponent from "../../components/ButtonComponent"

const Footer = () => {
    const [state, setState] = useState('')
    const [create, { isLoading, isSuccess }] = useCreateCategoryMutation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( isSuccess ) {
            dispatch(successAlert('Категория успешно создана'))
			setState('')
        }
    }, [isSuccess])

    return (
		<tr>
			<td />
			<td className="text-center">
				<Form.Control
					value={state}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState(e.target.value)
					}
					disabled={isLoading}
				/>
			</td>
			<td />
			<td className="text-center">
				<ButtonComponent onClick={() => create(state)} isLoading={isLoading} disabled={(state === '') || isLoading}>
					Создать
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Footer