import { FC } from "react"
import { Button, Modal, ModalProps } from "react-bootstrap"

interface IProps extends ModalProps {
    text?: string
}

const DescriptionModal: FC<IProps> = ({ onHide, text }) => {
    return (
		<Modal show={!!text} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Описание категории</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{text}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Скрыть
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default DescriptionModal