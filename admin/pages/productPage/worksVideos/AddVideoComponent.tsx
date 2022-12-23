import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAddWorksVideoMutation } from "../../../application/product.service";
import ButtonComponent from "../../../components/ButtonComponent";

const AddVideoComponent: FC<{ productId: string }> = ({ productId }) => {
	const [show, setShow] = useState(false)
	const [url, setUrl] = useState('')
    const [uploadVideo, { isLoading, isSuccess, reset }] = useAddWorksVideoMutation()

    const handler = () => uploadVideo({ id: productId, body: { url } })
	const hideHandler = useCallback(() => {
		setUrl("")
		setShow(false)
	}, [])

	useEffect(() => {
		if (isSuccess) {
			reset()
			hideHandler()
		}
	}, [isSuccess, reset, hideHandler])
    
    return (
		<div className="d-flex">
			<Modal show={show} onHide={hideHandler}>
				<Modal.Header closeButton />
				<Modal.Body>
					<div className="d-flex align-items-center">
						<div className="text-muted">
							Ссылка на ютуб
						</div>
					</div>
					<Form.Control value={url} onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)} />
				</Modal.Body>
				<Modal.Footer>
					<ButtonComponent onClick={handler} isLoading={isLoading}>OK</ButtonComponent>
				</Modal.Footer>
			</Modal>
			<Button variant="outline-primary">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-plus" viewBox="0 0 16 16">
					<path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
					<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
				</svg>
			</Button>
		</div>
	)
}

export default AddVideoComponent