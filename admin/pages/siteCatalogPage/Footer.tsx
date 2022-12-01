import { ChangeEvent, useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { successAlert } from "../../application/alertSlice"
import { useCreateCategoryMutation } from "../../application/category.service"
import { useAppDispatch } from "../../application/hooks"
import ButtonComponent from "../../components/ButtonComponent"

const Footer = () => {
	const { id: parentCategoryId } = useParams()
    const [title, setTitle] = useState('')
    const [create, { isLoading, isSuccess }] = useCreateCategoryMutation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( isSuccess ) {
            dispatch(successAlert('Категория успешно создана'))
			setTitle("")
        }
    }, [isSuccess])

    return (
		<tr>
			<td />
			<td className="text-center">
				<Form.Control value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} disabled={isLoading} />
			</td>
			<td />
			<td className="text-center">
				<ButtonComponent onClick={() => create({ title, parentCategoryId })} isLoading={isLoading} disabled={title === "" || isLoading}>
					Создать
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Footer