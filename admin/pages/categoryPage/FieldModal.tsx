import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Form, Modal, ModalProps } from "react-bootstrap"
import ButtonComponent from "../../components/ButtonComponent"
import { useAppDispatch } from '../../application/hooks'
import { successAlert } from "../../application/alertSlice"
import { useAddFilterValueMutation, useDeleteFilterValueMutation, useUpdateFilterValueMutation } from "../../application/category.service"

interface IProps extends ModalProps {
    id: string
	filterId: string
	fieldId?: string
	title?: string
}

const FieldModal: FC<IProps> = ({ id, filterId, fieldId, onHide, show, title }) => {
	const [state, setState] = useState("")
	const [create, { isLoading, isSuccess, reset }] = useAddFilterValueMutation()
	const [
		update,
		{ isLoading: updLoading, isSuccess: updSuccess, reset: updReset },
	] = useUpdateFilterValueMutation()
	const [
		remove,
		{ isLoading: rmLoading, isSuccess: rmSuccess, reset: rmReset },
	] = useDeleteFilterValueMutation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (title) {
			setState(title)
		}
		else {
			setState('')
		}
	}, [title])

	useEffect(() => {
		if (isSuccess) {
			setState("")
			if (onHide) {
				onHide()
			}
			dispatch(successAlert("Значение добавлено"))
			reset()
		}
	}, [isSuccess, onHide, dispatch, reset])

	useEffect(() => {
		if (updSuccess) {
			setState("")
			if (onHide) {
				onHide()
			}
			dispatch(successAlert("Значение обновлено"))
			updReset()
		}
	}, [updSuccess, onHide, dispatch, updReset])

	useEffect(() => {
		if (rmSuccess) {
			setState("")
			if (onHide) {
				onHide()
			}
			dispatch(successAlert("Значение удалено"))
			rmReset()
		}
	}, [rmSuccess, onHide, dispatch, rmReset])

	return (
		<Modal centered show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{fieldId ? <>Изменение</> : <>Добавление</>} значения
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Control
					autoFocus
					value={state}
					disabled={isLoading}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState(e.target.value)
					}
				/>
			</Modal.Body>
			<Modal.Footer>
				{fieldId && (
					<div className="me-auto">
						<ButtonComponent
							variant="link"
							size="sm"
							onClick={() =>
								remove({ id, body: { filterId, fieldId } })
							}
							className="text-danger"
							isLoading={rmLoading}
						>
							Удалить значение...
						</ButtonComponent>
					</div>
				)}
				<Button
					variant="secondary"
					size="sm"
					onClick={onHide}
					disabled={isLoading || updLoading || rmLoading}
				>
					Отмена
				</Button>
				<ButtonComponent
					disabled={rmLoading || state === (title || "")}
					isLoading={isLoading || updLoading}
					onClick={() =>
						fieldId
							? update({
									id,
									body: { filterId, fieldId, value: state },
							  })
							: create({ id, body: { filterId, value: state } })
					}
				>
					{fieldId ? "Изменить" : "Создать"}
				</ButtonComponent>
			</Modal.Footer>
		</Modal>
	)
}

export default FieldModal