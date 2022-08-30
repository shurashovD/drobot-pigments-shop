import { FC } from "react"
import { Form, FormCheckProps, Spinner } from "react-bootstrap"

interface IProps extends FormCheckProps {
	isLoading?: boolean
}

const CheckboxComponent: FC<IProps> = ({ checked, className, isLoading, onChange }) => {
	return (
		<div className="text-center align-middle">
			{isLoading ? (
				<Spinner animation="border" size="sm" variant="secondary" />
			) : (
				<Form.Check checked={checked} onChange={onChange} className={className} />
			)}
		</div>
	)
}

export default CheckboxComponent
