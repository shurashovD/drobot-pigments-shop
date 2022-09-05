import { FC } from "react"
import { Form, FormCheckProps, Spinner } from "react-bootstrap"

interface IProps extends FormCheckProps {
	isLoading?: boolean
}

const CheckboxComponent: FC<IProps> = ({ checked, className, isLoading, label, onChange }) => {
	return (
		<div className="text-center align-middle">
			{isLoading ? (
				<Spinner animation="border" size="sm" variant="secondary" />
			) : (
				<Form.Check checked={checked} onChange={onChange} className={className} label={label} />
			)}
		</div>
	)
}

export default CheckboxComponent
