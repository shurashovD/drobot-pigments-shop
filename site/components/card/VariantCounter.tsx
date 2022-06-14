import { ChangeEvent, FC } from "react"
import { Button, Form } from "react-bootstrap"
import { addToCart, addVariantToCart, rmFromCart, rmVariantFromCart, setQuantity, setVariantQuantity } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"

interface IProps {
    disabled?: boolean
	productId: string
    variantId: string
}

const VariantCounter: FC<IProps> = ({ disabled, productId, variantId }) => {
	const state = useAppSelector(
		(state) =>
			state.cartSlice.variants.find(
				(item) => item.variantId === variantId
			)?.quantity || 0
	)
	const dispatch = useAppDispatch()

	const handler = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target
		if (isNaN(parseInt(value))) return

		dispatch(setVariantQuantity({ variantId, quantity: parseInt(value) }))
	}

	return (
		<div
			className="d-flex w-100 justify-content-between align-items-center"
			style={{ maxWidth: "116px" }}
		>
			<Button
				disabled={disabled}
				variant="link"
				className="border border-dark p-0 d-flex justify-content-center align-items-center"
				style={{
					width: "28px",
					minWidth: "28px",
					maxWidth: "28px",
					height: "28px",
					minHeight: "28px",
					maxHeight: "28px",
				}}
				onClick={() => dispatch(rmVariantFromCart(variantId))}
			>
				-
			</Button>
			<Form.Control
				disabled={disabled}
				className="border-0 text-center"
				value={state}
				onChange={handler}
			/>
			<Button
				disabled={disabled}
				variant="link"
				className="border border-dark p-0 d-flex justify-content-center align-items-center"
				style={{
					width: "28px",
					minWidth: "28px",
					maxWidth: "28px",
					height: "28px",
					minHeight: "28px",
					maxHeight: "28px",
				}}
				onClick={() => dispatch(addVariantToCart({ productId, variantId }))}
			>
				+
			</Button>
		</div>
	)
}

export default VariantCounter