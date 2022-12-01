import { ChangeEvent, FC, useEffect } from "react"
import { useDeleteCategoryMutation, useUploadPhotoMutation } from "../../application/category.service"
import ButtonComponent from "../../components/ButtonComponent"
import { useAppDispatch } from '../../application/hooks'
import { successAlert } from "../../application/alertSlice"
import { Button, Form, Image } from "react-bootstrap"
import { NavLink } from "react-router-dom"

interface IProps {
    id: string,
    description?: string
    descriptionHandler: (id: string) => void,
    edittedHandler: (id: string) => void,
    photoHandler: (id: string) => void,
    photo?: string
    title: string
}

const Item: FC<IProps> = ({ id, description, descriptionHandler, edittedHandler, photo, photoHandler, title }) => {
    const [upload, { isLoading: photoLoading, isSuccess: photoSuccess }] = useUploadPhotoMutation()
    const [remove, { isLoading, isSuccess }] = useDeleteCategoryMutation()
    const dispatch = useAppDispatch()

    const fileHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if ( file ) {
            const body = new FormData()
            body.append('photo', file)
            upload({ id, body })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            dispatch(successAlert('Категория успешно удалена'))
        }
    }, [isSuccess])

    useEffect(() => {
		if (photoSuccess) {
			dispatch(successAlert("Фото успешно загружено"))
		}
	}, [photoSuccess])

    return (
		<tr className="align-middle">
			<td className="text-center">
				{photo ? (
					<Button className="p-0" variant="link" onClick={() => photoHandler(id)}>
						<Image width={80} src={photo} alt="product" />
					</Button>
				) : (
					<label>
						<span className="text-primary">Загрузить фото</span>
						<Form.Control
							type="file"
							accept="image/*"
							onChange={fileHandler}
							disabled={photoLoading}
							style={{ height: 0, width: 0, padding: 0 }}
						/>
					</label>
				)}
			</td>
			<td className="text-center">
				<NavLink to={`/admin/category-products/${id}`}>{title}</NavLink>
			</td>
			<td className="text-center">
				<NavLink to={`/admin/category-subcategories/${id}`}>Подкатегории</NavLink>
			</td>
			<td className="text-center d-none">
				<ButtonComponent onClick={() => (description ? descriptionHandler(id) : edittedHandler(id))}>Описание</ButtonComponent>
			</td>
			<td className="text-center">
				<ButtonComponent onClick={() => edittedHandler(id)}>Изменить</ButtonComponent>
			</td>
			<td className="text-center">
				<ButtonComponent variant="link" className="text-danger" size="sm" isLoading={isLoading} onClick={() => remove(id)}>
					Удалить
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Item