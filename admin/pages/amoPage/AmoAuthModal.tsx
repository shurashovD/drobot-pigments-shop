import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, Modal, ModalProps } from "react-bootstrap"
import { useAuthMutation } from "../../application/amo.service"
import ButtonComponent from "../../components/ButtonComponent"

const AmoAuthModal: FC<ModalProps> = ({ onHide, show }) => {
    const [state, setState] = useState('')
    const [auth, { isLoading, isSuccess }] = useAuthMutation()

    const hideHandler = () => {
        setState('')
        if ( onHide ) {
            onHide()
        }
    }

    useEffect(() => {
        if ( isSuccess ) {
            hideHandler()
        }
    }, [isSuccess, hideHandler])

    return (
		<Modal show={show} onHide={hideHandler}>
			<Modal.Header closeButton />
			<Modal.Body>
				<p>Введите код авторизации</p>
				<Form.Control
					value={state}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState(e.target.value)
					}
				/>
				<small className="text-muted">
					Получить код можно по{" "}
					<a
						href="https://drobotpm.amocrm.ru/amo-market/#category-installed"
						target="_blank"
					>
						этой ссылке
					</a>
					, далее "Сайт drobot-pigments-shop.ru", вкладка "Ключи и доступы"
				</small>
			</Modal.Body>
			<Modal.Footer>
				<ButtonComponent
					disabled={state === ""}
					isLoading={isLoading}
					onClick={() => auth({ code: state })}
				>
					OK
				</ButtonComponent>
			</Modal.Footer>
		</Modal>
	)
}

export default AmoAuthModal