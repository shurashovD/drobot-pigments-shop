import { ChangeEvent, FC, useRef } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"

interface IProps {
    value: string
    disabled: boolean
    onChange: (value: string) => void
    placeholder?: string
}

const DateInput: FC<IProps> = ({ disabled, onChange, placeholder, value }) => {
    const input = useRef<any | null>(null)
    const formatter = new Intl.DateTimeFormat('ru', {
        day: 'numeric', month: '2-digit', year: '2-digit'
    })

    const handler = () => {
        if ( input.current ) {
            input.current.showPicker()
        }
    }

    return (
		<Row className="border border-primary p-0 py-3 flex-nowrap m-0">
			<Col xs={2} className="text-muted d-flex align-items-center">
				{placeholder}
			</Col>
			<Col xs={6} className="d-flex align-items-center">
				{value !== "" && <>{formatter.format(Date.parse(value))}</>}
				<Form.Control
					type="date"
					style={{ width: "0", height: "0" }}
					className="border-0 p-0 m-0"
					disabled={disabled}
					value={value}
					onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
					ref={input}
				/>
			</Col>
			<Col xs="auto" className="d-flex">
				{value === "" ? (
					<Button
						variant="link"
						className="m-auto p-0 border-0 d-flex justify-content-center align-items-center"
						style={{ width: "24px", height: "24px" }}
						disabled={disabled}
						onClick={handler}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M19.4677 3.59619H4.53516C4.01739 3.59619 3.59766 4.01592 3.59766 4.53369V19.4662C3.59766 19.984 4.01739 20.4037 4.53516 20.4037H19.4677C19.9854 20.4037 20.4052 19.984 20.4052 19.4662V4.53369C20.4052 4.01592 19.9854 3.59619 19.4677 3.59619Z"
								stroke="#AB9A9A"
								strokeWidth="0.8"
							/>
							<path d="M3.59766 7.72119H20.4052" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M7.38672 3.59668V1.72168" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M16.3711 3.59619V1.72119" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M8.35898 10.4697H6.05273V12.776H8.35898V10.4697Z" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M13.0992 10.4697H10.793V12.776H13.0992V10.4697Z" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M17.7789 10.4697H15.4727V12.776H17.7789V10.4697Z" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M8.44102 14.8799H6.13477V17.1861H8.44102V14.8799Z" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M13.1852 14.8799H10.8789V17.1861H13.1852V14.8799Z" stroke="#AB9A9A" strokeWidth="0.8" />
							<path d="M17.8648 14.8799H15.5586V17.1861H17.8648V14.8799Z" stroke="#AB9A9A" strokeWidth="0.8" />
						</svg>
					</Button>
				) : (
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
				)}
			</Col>
		</Row>
	)
}

export default DateInput