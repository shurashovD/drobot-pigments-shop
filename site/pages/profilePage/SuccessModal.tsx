import { Button, Image, Modal } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../application/hooks'
import { profileToggleSuccesModal } from '../../application/profileSlice'
const logo = require('../../img/logo.svg')

const SuccessModal = () => {
	const { show, message } = useAppSelector(state => state.profileSlice.successModal)
	const dispatch = useAppDispatch()

    return (
		<Modal show={show} onHide={() => dispatch(profileToggleSuccesModal())}>
			<Modal.Body className="bg-primary pb-6 px-5">
				<Modal.Header
					closeButton
					closeVariant="white"
					className="border-0"
				/>
				<div className="text-uppercase text-white text-center mb-3">
					{message}
				</div>
				<div className="text-center mb-5">
					<Image src={logo} width={106} />
				</div>
				<div className="text-center">
					<Button
						onClick={() => dispatch(profileToggleSuccesModal())}
						variant="secondary"
					>
						OK
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default SuccessModal