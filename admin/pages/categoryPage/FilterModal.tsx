import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Form, Modal, ModalProps } from "react-bootstrap"
import { useCreateFilterMutation, useDeleteFilterMutation, useUpdateFilterMutation } from "../../application/category.service"
import ButtonComponent from "../../components/ButtonComponent"
import { useAppDispatch } from '../../application/hooks'
import { successAlert } from "../../application/alertSlice"

interface IProps extends ModalProps {
    id: string
	filterId?: string
	title?: string
}

const FilterModal: FC<IProps> = ({ id, filterId, onHide, show, title }) => {
	const [state, setState] = useState('')
	const [create, { isLoading, isSuccess, reset }] = useCreateFilterMutation()
	const [update, { isLoading: updLoading, isSuccess: updSuccess, reset: updReset }] =
		useUpdateFilterMutation()
	const [remove, { isLoading: rmLoading, isSuccess: rmSuccess, reset: rmReset }] = useDeleteFilterMutation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( title ) {
			setState(title)
		}
	}, [title])

	useEffect(() => {
		if (isSuccess) {
			setState("")
			if (onHide) {
				onHide()
			}
			dispatch(successAlert("Фильтр создан"))
			reset()
		}
	}, [isSuccess, onHide, dispatch, reset])

	useEffect(() => {
		if (updSuccess) {
			setState("")
			if (onHide) {
				onHide()
			}
			dispatch(successAlert("Фильтр обновлён"))
			updReset()
		}
	}, [updSuccess, onHide, dispatch, updReset])

	useEffect(() => {
		if (rmSuccess) {
			setState("")
			if (onHide) {
				onHide()
			}
			dispatch(successAlert("Фильтр удалён"))
			rmReset()
		}
	}, [rmSuccess, onHide, dispatch, rmReset])

	return (
		<Modal centered show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{filterId ? <>Изменение</> : <>Добавление</>} фильтра
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
				{filterId && (
					<div className="me-auto">
						<ButtonComponent
							variant="link"
							size="sm"
							onClick={() => remove({ id, body: { filterId } })}
							className="text-danger"
							isLoading={rmLoading}
						>
							Удалить фильтр...
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
					disabled={rmLoading || (state === (title || ""))}
					isLoading={isLoading || updLoading}
					onClick={() =>
						filterId
							? update({ id, body: { filterId, title: state } })
							: create({ id, title: state })
					}
				>
					{filterId ? "Изменить" : "Создать"}
				</ButtonComponent>
			</Modal.Footer>
		</Modal>
	)
}

export default FilterModal