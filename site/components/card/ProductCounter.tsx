import { ChangeEvent, FC } from "react"
import { Button, Form } from "react-bootstrap"
import { addToCart, rmFromCart, setQuantity } from "../../application/cartSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"

interface IProps {
    disabled?: boolean
    productId: string
}

const ProductCounter: FC<IProps> = ({ disabled, productId }) => {
    const state = useAppSelector(state => state.cartSlice.products.find(item => item.productId === productId)?.quantity || 0)
    const dispatch = useAppDispatch()

    const handler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if ( isNaN(parseInt(value)) ) return

        dispatch(setQuantity({ productId, quantity: parseInt(value)}))
    }

    return (
		<div
			className="d-flex w-100 justify-content-between align-items-center"
			style={{ maxWidth: "116px" }}
		>
			<Button
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
				onClick={() => dispatch(rmFromCart(productId))}
			>
				-
			</Button>
			<Form.Control
				className="border-0 text-center"
				value={state}
				onChange={handler}
			/>
			<Button
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
				onClick={() => dispatch(addToCart(productId))}
			>
				+
			</Button>
		</div>
	)
}

export default ProductCounter