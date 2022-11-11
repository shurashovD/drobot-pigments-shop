import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, Modal, ModalProps } from "react-bootstrap"
import { useCasheOutputMutation } from "../../../application/profile.service"
import ButtonComponent from "../../../components/ButtonComponent"
import { useAccountAuthQuery } from '../../../application/account.service'
import { useAppDispatch } from "../../../application/hooks"
import { profileToggleSuccesModal } from "../../../application/profileSlice"

const CashOutModal: FC<ModalProps> = ({ onHide, show }) => {
    const { data, isFetching } = useAccountAuthQuery(undefined)
    const [casheSize, setCasheSize] = useState(0)
    const [cashOut, { isLoading, isSuccess, reset }] = useCasheOutputMutation()
    const dispatch = useAppDispatch()

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if ( !isNaN(+value) ) {
            setCasheSize(+value)
        }
    }

    const hideHandler = () => {
        setCasheSize(0)
        if ( onHide ) {
            onHide()
        }
    }

    useEffect(() => {
        if ( isSuccess ) {
            hideHandler()
            reset()
            dispatch(profileToggleSuccesModal('Заявка отправлена'))
        }
    }, [dispatch, isSuccess, profileToggleSuccesModal, reset, hideHandler])

    useEffect(() => {
        if ( data?.cashBack ) {
            setCasheSize(data.cashBack)
        }
    }, [data])

    return (
		<Modal onHide={hideHandler} show={show}>
			<Modal.Body className="bg-primary">
				<Modal.Header closeButton closeVariant="white" className="border-0" />
				<Form.Group className="mb-3">
					<Form.Label className="w-100">
						<div className="text-muted mb-1">Размер выводимого кэша</div>
						<Form.Control disabled={isLoading || isFetching} value={casheSize} onChange={inputHandler} className="text-light p-3 border-secondary" />
					</Form.Label>
				</Form.Group>
				<ButtonComponent variant="secondary" isLoading={isLoading} onClick={() => cashOut({ casheSize })} disabled={casheSize === 0 || isFetching}>
					Вывести
				</ButtonComponent>
			</Modal.Body>
		</Modal>
	)
}

export default CashOutModal