import { ChangeEvent, FC } from "react"
import { Button, Col, Fade, Form, Row } from "react-bootstrap"

interface IProps {
	value: string
	disabled: boolean
	onChange: (value: string) => void
	placeholder?: string
}

const CodeInput: FC<IProps> = ({ disabled, onChange, placeholder, value }) => {
	return (
		<Row className="border border-primary p-0 py-3 pe-2 flex-nowrap m-0">
			<Col xs={10} className="d-flex">
				<Form.Control
					disabled={disabled}
					value={value}
					placeholder={placeholder}
					className="border-0 p-0 m-auto w-100"
					onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
				/>
			</Col>
			<Col xs="auto" className="d-flex">
				<Fade in={value !== ''}>
					<Button
						className="m-auto p-0 bg-secondary rounded-circle border-0 d-flex justify-content-center align-items-center"
						style={{ width: "24px", height: "24px" }}
						disabled={disabled}
						onClick={() => onChange("")}
					>
						<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.591797 0.592773L7.58834 7.58932" stroke="#39261F" strokeWidth="0.5" />
							<path d="M7.58834 0.592773L0.591797 7.58932" stroke="#39261F" strokeWidth="0.5" />
						</svg>
					</Button>
				</Fade>
			</Col>
		</Row>
	)
}

export default CodeInput