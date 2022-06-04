import { FC, useEffect } from 'react'
import { Image, Modal, ModalProps } from 'react-bootstrap'
import { successAlert } from '../../application/alertSlice'
import { useDeletePhotoMutation } from '../../application/category.service'
import { useAppDispatch } from '../../application/hooks'
import ButtonComponent from '../../components/ButtonComponent'

interface IPhotoModalProps extends ModalProps {
	id: string
    src?: string
}
const PhotoModalComponent: FC<IPhotoModalProps> = ({ id, onHide, src }) => {
	const [rm, { isLoading, isSuccess }] = useDeletePhotoMutation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( isSuccess ) {
			if ( onHide ) {
				onHide()
			}
			dispatch(successAlert('Фото успешно удалено'))
		}
	}, [isSuccess])

    return (
		<Modal
			centered
			aria-labelledby="photoView"
			show={!!src}
			onHide={onHide}
			size="lg"
		>
			<Modal.Header closeButton />
			<Modal.Body className="text-center">
				<Image alt="photo-view" src={src} fluid />
			</Modal.Body>
			<Modal.Footer>
				<ButtonComponent onClick={() => rm(id)} isLoading={isLoading} variant="link" className="text-danger" >
					Удалить...
				</ButtonComponent>
			</Modal.Footer>
		</Modal>
	)
}

export default PhotoModalComponent