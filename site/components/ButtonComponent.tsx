import { FC } from "react"
import { Button, ButtonProps, Spinner } from "react-bootstrap"

interface IProps extends ButtonProps {
    isLoading?: boolean
}

const ButtonComponent: FC<IProps> = ({ children, className, disabled, isLoading, onClick, size = "sm", variant = 'primary' }) => {
    return (
		<div className="text-center align-middle position-relative">
			<div className={`position-absolute start-0 end-0 top-0 bottom-0 d-flex justify-content-center align-items-center ${!isLoading ? "invisible" : "visible"}`}>
				<Spinner animation="border" size="sm" variant={variant} />
			</div>
			<Button
				variant={variant}
				className={`py-3 px-4 rounded-0 text-uppercase ${className} ${isLoading ? "invisible" : "visible"}`}
				disabled={disabled}
				onClick={onClick}
				size={size}
			>
				{children}
			</Button>
		</div>
	)
}

export default ButtonComponent