import { ChangeEvent, FC } from "react"
import { Button, Form } from "react-bootstrap"
import { setCartBusy } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useChangeVariantInCartMutation } from "../../application/order.service"

interface IProps {
	productId: string
	variantId: string
}

const VariantCounter: FC<IProps> = ({ productId, variantId }) => {
	const quantity = useAppSelector(state => state.cartSlice.variants.find(item => item.variantId === variantId)?.quantity || 0)
	const disabled = useAppSelector(state => state.cartSlice.cartBusy)
	const [changeVariantInCart] = useChangeVariantInCartMutation()
	const dispatch = useAppDispatch()

	const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if ( disabled ) return
		const { value } = event.target
		if (isNaN(parseInt(value))) return
		dispatch(setCartBusy(true))
		changeVariantInCart({ productId, variantId, quantity: parseInt(value) })
	}

	const handlerDec = () => {
		dispatch(setCartBusy(true))
		changeVariantInCart({ productId, variantId, quantity: quantity - 1 })
	}

	const handlerInc = () => {
		dispatch(setCartBusy(true))
		changeVariantInCart({ productId, variantId, quantity: quantity + 1 })
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
				onClick={handlerDec}
			>
				-
			</Button>
			<Form.Control
				className="border-0 text-center p-0"
				value={quantity}
				onChange={inputHandler}
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
				onClick={handlerInc}
			>
				+
			</Button>
		</div>
	)
}

export default VariantCounter