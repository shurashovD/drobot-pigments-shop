import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useChangeVariantInCartMutation, useGetCartQuery } from "../../application/order.service"

interface IProps {
	productId: string
	variantId: string
}

const VariantCounter: FC<IProps> = ({ productId, variantId }) => {
	const { data: cart, isFetching } = useGetCartQuery(undefined)
	const [quantity, setQuantity] = useState(0)
	const [changeVariantInCart, { isLoading }] = useChangeVariantInCartMutation()

	const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if (isFetching || isLoading) return
		const { value } = event.target
		if (isNaN(parseInt(value))) return
		changeVariantInCart({ productId, variantId, quantity: parseInt(value) })
	}

	const handlerDec = () => {
		changeVariantInCart({ productId, variantId, quantity: Math.max(quantity - 1, 0) })
	}

	const handlerInc = () => {
		changeVariantInCart({ productId, variantId, quantity: quantity + 1 })
	}

	useEffect(() => {
		if ( cart ) {
			const quantity = cart.variants.find(item => item.variantId === variantId)?.quantity || 0
			setQuantity(quantity)
		}
	}, [cart, variantId])

	return (
		<div className="d-flex w-100 justify-content-between align-items-center" style={{ maxWidth: "116px" }}>
			<Button
				disabled={isFetching || isLoading}
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
			<Form.Control className="border-0 text-center p-0" value={quantity} onChange={inputHandler} />
			<Button
				disabled={isFetching || isLoading}
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