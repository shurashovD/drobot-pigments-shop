import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Card, Form, Spinner } from "react-bootstrap"
import { successAlert } from "../../application/alertSlice"
import { useAppDispatch } from "../../application/hooks"
import { useRmProductPhotoMutation, useSetProductDescriptionMutation, useSetProductPhotoMutation } from "../../application/product.service"
import ButtonComponent from "../../components/ButtonComponent"

interface IProps {
    disabled: boolean
    id: string
    photo?: string
    name: string
    description?: string
}

const ProductCard: FC<IProps> = (props) => {
    const [descriptionEdit, setDescriptionEdit] = useState<string | undefined>()
	const [setDescription, { isLoading: descLoading, isSuccess: descSuccess }] =
		useSetProductDescriptionMutation()
    const [rmPhoto, { isLoading: rmPhLoading, isSuccess: rmPhSuccess }] = useRmProductPhotoMutation()
    const [uploadPhoto, { isLoading: photoLoading, isSuccess: photoSuccess }] = useSetProductPhotoMutation()
	const dispatch = useAppDispatch()

    const fileHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if ( file ) {
            const body = new FormData()
            body.append('photo', file)
            uploadPhoto({ id: props.id, body })
        }
    }

    useEffect(() => {
		if (descSuccess) {
			dispatch(successAlert("Описание установлено"))
			setDescriptionEdit(undefined)
		}
	}, [descSuccess, dispatch, successAlert])

    useEffect(() => {
        if ( rmPhSuccess ) {
            dispatch(successAlert('Фото удалено'))
        }
    }, [rmPhSuccess, dispatch, successAlert])

    useEffect(() => {
		if (photoSuccess) {
			dispatch(successAlert("Фото загружено"))
		}
	}, [photoSuccess, dispatch, successAlert])

    return (
		<Card>
			{props.photo && <Card.Img alt="product" src={props.photo} />}
			<Card.Body>
				<Card.Title>{props.name}</Card.Title>
				<Card.Text>
					{typeof descriptionEdit === "string" ? (
						<Form.Control
							as="textarea"
							rows={3}
							value={descriptionEdit}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setDescriptionEdit(e.target.value)
							}
						/>
					) : (
						<pre style={{ whiteSpace: 'pre-wrap' }}>{props.description}</pre>
					)}
				</Card.Text>
				{typeof descriptionEdit === "string" ? (
					<div className="d-flex justify-content-between">
						<ButtonComponent
							isLoading={descLoading}
							onClick={() =>
								setDescription({
									id: props.id,
									body: { description: descriptionEdit },
								})
							}
						>
							Сохранить
						</ButtonComponent>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setDescriptionEdit(undefined)}
						>
							Отмена
						</Button>
					</div>
				) : (
					<div className="d-flex justify-content-between">
						<Button
							disabled={props.disabled}
							onClick={() =>
								setDescriptionEdit(props.description || "")
							}
							size="sm"
						>
							{props.description && props.description !== "" ? (
								<>Изменить</>
							) : (
								<>Создать</>
							)}{" "}
							описание
						</Button>
						{props.photo ? (
							<ButtonComponent
								variant="link"
								className="text-danger"
								onClick={() => rmPhoto(props.id)}
								isLoading={rmPhLoading}
								disabled={props.disabled}
							>
								Удалить фото
							</ButtonComponent>
						) : (
							<label>
								{photoLoading ? (
									<Spinner
										size="sm"
										variant="priamry"
										animation="border"
									/>
								) : (
									<small className="btn btn-primary p-1 px-2">
										Загрузить фото
									</small>
								)}
								<input
									type="file"
									style={{ padding: 0, width: 0, height: 0 }}
									onChange={fileHandler}
									disabled={photoLoading}
                                    accept="image/*"
								/>
							</label>
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	)
}

export default ProductCard