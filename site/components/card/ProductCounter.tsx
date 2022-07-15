import { ChangeEvent, FC } from "react"
import { Button, Form } from "react-bootstrap"
import { setCartBusy } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { useChangeProductInCartMutation } from "../../application/order.service"

interface IProps {
	productId: string
}

const ProductCounter: FC<IProps> = ({ productId }) => {
	const quantity = useAppSelector(state => state.cartSlice.products.find(item => item.productId === productId)?.quantity || 0)
	const disabled = useAppSelector(state => state.cartSlice.cartBusy)
	const dispatch = useAppDispatch()
	const [changeProduct] = useChangeProductInCartMutation()

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if ( disabled ) return
        const { value } = event.target
        if ( isNaN(parseInt(value)) ) return
		dispatch(setCartBusy(true))
        changeProduct({ productId, quantity: parseInt(value) })
    }

	const handlerInc = () => {
		dispatch(setCartBusy(true))
		changeProduct({ productId, quantity: quantity + 1 })
	}

	const handlerDec = () => {
		dispatch(setCartBusy(true))
		changeProduct({ productId, quantity: quantity - 1 })
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
				disabled={disabled}
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

export default ProductCounter