import { FC } from "react"
import { Button, ButtonProps, Spinner } from "react-bootstrap"

interface IProps extends ButtonProps {
    isLoading?: boolean
}

const ButtonComponent: FC<IProps> = ({ children, className, disabled, isLoading, onClick, size = "sm", variant = 'primary' }) => {
    return (
		<div className="text-center align-middle">
			{isLoading ? (
				<Spinner animation="border" size="sm" variant={variant} />
			) : (
				<Button
					variant={variant}
					className={`py-3 px-4 rounded-0 text-uppercase ${className}`}
					disabled={disabled}
					onClick={onClick}
					size={size}
				>
					{children}
				</Button>
			)}
		</div>
	)
}

export default ButtonComponent