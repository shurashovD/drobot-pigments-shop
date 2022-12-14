import { FC, useEffect } from "react"
import { Button, Modal, ModalProps } from "react-bootstrap"
import ReactPlayer from 'react-player'
import { successAlert } from "../../../application/alertSlice"
import { useAppDispatch } from "../../../application/hooks"
import { useRmWorksVideoMutation } from "../../../application/product.service"

interface IProps extends ModalProps {
	src?: string
    productId: string
}

const ModalVideoPlayer: FC<IProps> = ({ src, productId, onHide, show }) => {
	const [rm, { isLoading, isSuccess, reset }] = useRmWorksVideoMutation()
	const dispatch = useAppDispatch()

	const rmHandler = () => {
        if ( src ) {
            const body = { video: src }
			rm({ body, id: productId })
        }
	}

	useEffect(() => {
		if (isSuccess) {
			dispatch(successAlert("Видео удалено"))
			reset()
            if ( onHide ) {
                onHide()
            }
		}
	}, [dispatch, onHide, successAlert, isSuccess, reset])

	return (
		<Modal onHide={onHide} show={show}>
			<Modal.Header closeButton />
			<Modal.Body>
				<ReactPlayer url={src} controls={true} width="100%" height="auto" />
			</Modal.Body>
			<Modal.Footer>
				<Button variant="link" className="text-danger" onClick={rmHandler} disabled={isLoading}>
					Удалить видео...
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ModalVideoPlayer