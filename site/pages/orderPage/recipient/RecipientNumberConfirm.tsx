import classNames from "classnames"
import { FC } from "react"
import { Button } from "react-bootstrap"

interface IProps {
	isConfirm: boolean
    shortNumber: boolean
	numberIsChanged: boolean
	checkNumber: () => void
}

const RecipientNumberConfirm: FC<IProps> = ({ checkNumber, isConfirm, numberIsChanged, shortNumber }) => {
	const handler = () => {
		if ( isConfirm && numberIsChanged ) {
			checkNumber()
		}
		if ( !isConfirm ) {
			checkNumber()
		}
	}

	return (
		<Button variant={isConfirm ? "light" : "outline-danger"} className={classNames("p-3", {"border border-muted": isConfirm})}
			disabled={shortNumber} onClick={handler}>
			{isConfirm && numberIsChanged && <>Привязать новый</>}
			{isConfirm && !numberIsChanged && <>Номер подтверждён</>}
			{!isConfirm && <>Подтвердить номер</>}
		</Button>
	)
}

export default RecipientNumberConfirm