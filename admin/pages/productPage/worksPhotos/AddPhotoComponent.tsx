import classNames from "classnames";
import { ChangeEvent, FC } from "react";
import { Spinner } from "react-bootstrap";
import { useAddWorksPhotoMutation } from "../../../application/product.service";

const AddPhotoComponent: FC<{ productId: string }> = ({ productId }) => {
    const [uploadPhoto, { isLoading }] = useAddWorksPhotoMutation()

    const handler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if ( file ) {
            const body = new FormData()
			body.append("photo", file)
			uploadPhoto({ id: productId, body })
        }
    }
    
    return (
		<div className="d-flex">
			<label className={classNames({ "d-none": isLoading }, "btn btn-outline-primary position-relative")}>
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-plus" viewBox="0 0 16 16">
					<path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
					<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
				</svg>
				<input type="file" className="position-absolute invisible p-0" onChange={handler} accept="image/*" />
			</label>
			<Spinner animation="border" className={classNames({ "d-none": !isLoading }, "m-auto")} />
		</div>
	)
}

export default AddPhotoComponent