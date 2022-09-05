import { FC } from "react"
import { Button } from "react-bootstrap"
import IconGreenCheckmark from "../../../components/icons/IconGreenCheckmark"

interface IProps {
	isConfirm: boolean
    shortNumber: boolean
	numberIsChanged: boolean
	checkNumber: () => void
}

const RecipientNumberConfirm: FC<IProps> = ({ checkNumber, isConfirm, numberIsChanged, shortNumber }) => {
	return (
		<div>
			{isConfirm ? (
				<div className="d-flex align-items-center">
					{!numberIsChanged && <IconGreenCheckmark stroke="#93FA82" />}
					<Button
						variant="link"
						className="sign-tel-btn-success ms-2"
						disabled={shortNumber}
						onClick={() => (numberIsChanged ? checkNumber() : {})}
					>
						{numberIsChanged ? <>Привязать новый</> : <>Номер подтверждён</>}
					</Button>
				</div>
			) : (
				<Button variant="link" className="sign-tel-btn" disabled={shortNumber} onClick={() => checkNumber()}>
					Подтвердить номер
				</Button>
			)}
		</div>
	)
}

export default RecipientNumberConfirm