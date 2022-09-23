import { FC } from "react"
import { Form, FormCheckProps, Spinner } from "react-bootstrap"
import classnames from 'classnames'

interface IProps extends FormCheckProps {
	isLoading?: boolean
}

const CheckboxComponent: FC<IProps> = ({ checked, className, isLoading, label, onChange }) => {
	return (
		<div className="d-flex justify-content-center align-items-center">
			<label className="d-flex align-items-center">
				<input type="checkbox" checked={checked} onChange={onChange} disabled={isLoading} className="custom-checkbox" />
				{isLoading ? (
					<Spinner animation="border" variant="secondary" style={{ width: "20px", height: "20px" }} />
				) : (
					<div
						className={classnames("border border-primary text-center d-flex justify-content-center align-items-center", className, {
							"bg-secondary": checked
						})}
						style={{ width: "20px", height: "20px" }}
					>
						{checked && (
							<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5.42331 12L0 6.81356L0.730062 6L5.42331 10.5763L16.2699 0L17 0.711862L5.42331 12Z" fill="#39261F" />
							</svg>
						)}
					</div>
				)}
				{label && <span className="ms-2">{label}</span>}
			</label>
		</div>
	)
}

export default CheckboxComponent
