import { Button } from "react-bootstrap"
import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { useSetProductBindMutation } from "../application/product.service"
import ButtonComponent from "./ButtonComponent"
import { useAppDispatch, useAppSelector } from "../application/hooks"
import { hideBindLabelModal } from "../application/bindLabelModalSlice"

interface IProps {
	refetch?: () => any
}

const BindLabelModal: FC<IProps> = ({ refetch }) => {
    const { bindId, bindProductId, productId, show } = useAppSelector(state => state.bindLabelModalSlice)
    const dispatch = useAppDispatch()
    const [setBind, { isLoading, isSuccess }] = useSetProductBindMutation()
    const [bindLabel, setBindLabel] = useState('')

	const handler = () => {
		if ( bindId && bindProductId && productId ) {
			setBind({
				id: productId,
				body: {
					bindId,
					bindLabel,
					productId: bindProductId,
				},
			})
		}
	}

    useEffect(() => {
        if ( isSuccess ) {
			setBindLabel('')
            dispatch(hideBindLabelModal())
			if (refetch) {
				refetch()
			}
        }
    }, [isSuccess, dispatch, hideBindLabelModal])

    return (
		<Modal show={show} onHide={() => dispatch(hideBindLabelModal())}>
			<Modal.Header closeButton>Название товара в связи</Modal.Header>
			<Modal.Body>
				<Form.Control
					value={bindLabel}
					placeholder="Например, 5мл или XS"
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setBindLabel(e.target.value)
					}
					disabled={isLoading}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button
					disabled={isLoading}
					size="sm"
					variant="secondary"
					onClick={() => dispatch(hideBindLabelModal())}
					className="me-auto"
				>
					Отмена
				</Button>
				<ButtonComponent
					isLoading={isLoading}
					disabled={bindLabel === ""}
					onClick={handler}
				>
					Сохранить
				</ButtonComponent>
			</Modal.Footer>
		</Modal>
	)
}

export default BindLabelModal