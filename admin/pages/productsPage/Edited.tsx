import { ChangeEvent, FC, useEffect, useState } from "react"
import ButtonComponent from "../../components/ButtonComponent"
import { useAppDispatch } from "../../application/hooks"
import { successAlert } from "../../application/alertSlice"
import { Form } from "react-bootstrap"
import { useUpdateCategoryMutation } from "../../application/category.service"

interface IProps {
	id: string
    description: string
    resetEditted: () => void
	title: string
}

const Edited: FC<IProps> = ({ id, description, resetEditted, title }) => {
    const [state, setState] = useState({ description, title })
    const [update, { isLoading, isSuccess }] = useUpdateCategoryMutation()
	const dispatch = useAppDispatch()

    const handler = () => {
        update({ id, body: state })
    }

	useEffect(() => {
		if (isSuccess) {
			dispatch(successAlert("Категория успешно изменена"))
            resetEditted()
		}
	}, [isSuccess])

	return (
		<tr className="align-middle">
			<td />
			<td className="text-center">
				<Form.Control
					value={state.title}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState((state) => ({
							...state,
							title: e.target.value,
						}))
					}
					disabled={isLoading}
				/>
			</td>
			<td>
				<Form.Control
					as="textarea"
					rows={3}
					value={state.description}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState((state) => ({
							...state,
							description: e.target.value,
						}))
					}
					disabled={isLoading}
				/>
			</td>
			<td className="text-center">
				<ButtonComponent
					onClick={handler}
					isLoading={isLoading}
					disabled={state.title === "" || ((state.title === title) && (state.description === description))}
				>
					Сохранить
				</ButtonComponent>
			</td>
			<td className="text-center">
				<ButtonComponent onClick={resetEditted} disabled={isLoading}>
					Отмена
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Edited