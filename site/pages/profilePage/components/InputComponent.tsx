import { ChangeEvent, FC, useRef } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";

interface IProps {
    disabled?: boolean
    value: string
	placeholder?: string
    title?: string
    label?: string
    handler?: (e: ChangeEvent<HTMLInputElement>) => void
    invalid: boolean
}

const InputComponent: FC<IProps> = ({ disabled, label, handler, invalid, placeholder, value, title }) => {
    const input = useRef<HTMLInputElement | null>(null)

    return (
		<div className="d-flex align-items-center w-100">
			{label && (
				<div className="text-muted me-2 white-space">{label}: </div>
			)}
			<Form.Control
				disabled={disabled}
				value={value}
				className="profile-input"
				onChange={handler}
				ref={input}
				placeholder={placeholder}
			/>
			<OverlayTrigger
                placement="right"
                overlay={<Tooltip>{title}</Tooltip>}
            >
				<Button
					variant="link"
					className={`profile-edit__btn ms-auto ${
						invalid && "invalid"
					}`}
					onClick={() => input?.current?.focus()}
				/>
			</OverlayTrigger>
		</div>
	)
}

export default InputComponent