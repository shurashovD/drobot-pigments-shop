import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useChangeVariantInCartMutation, useGetCartQuery } from "../../application/order.service"

interface IProps {
	productId: string
	variantId: string
}

const VariantCounter: FC<IProps> = ({ productId, variantId }) => {
	const { data: cart, isFetching, isSuccess } = useGetCartQuery(undefined)
	const [quantity, setQuantity] = useState("")
	const [changeVariantInCart, { isLoading }] = useChangeVariantInCartMutation()
	const debounceTimerId = useRef<ReturnType<typeof setTimeout> | undefined>()

	const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if (isFetching || isLoading) return
		const { value } = event.target
		if ( value === "" ) {
			setQuantity("")
			if (debounceTimerId.current) {
				clearTimeout(debounceTimerId.current)
			}
			return
		}
		if (isNaN(parseInt(value))) return
		if (debounceTimerId.current) {
			clearTimeout(debounceTimerId.current)
		}
		setQuantity(value)
		debounceTimerId.current = setTimeout(() => {
			changeVariantInCart({ productId, variantId, quantity: parseInt(value) })
		}, 500)
	}

	const handlerDec = () => {
		changeVariantInCart({ productId, variantId, quantity: Math.max(+quantity - 1, 0) })
	}

	const handlerInc = () => {
		changeVariantInCart({ productId, variantId, quantity: +quantity + 1 })
	}

	const blurHandler = () => {
		if ( quantity === "" ) {
			const quantity = cart?.variants.find((item) => item.variantId === variantId)?.quantity || 0
			setQuantity(quantity.toString())
		}
	}

	useEffect(() => {
		if ( cart && isSuccess && !isFetching ) {
			const quantity = cart.variants.find(item => item.variantId === variantId)?.quantity || 0
			setQuantity(quantity.toString())
		}
	}, [cart, variantId, isSuccess, isFetching])

	return (
		<div className="d-flex align-items-center">
			<Button
				disabled={isFetching || isLoading}
				variant="link"
				className="border border-muted p-0 d-flex justify-content-center align-items-center"
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
			<Form.Control className="border-0 text-center p-0" value={quantity} onChange={inputHandler} onBlur={blurHandler} style={{ width: '50px' }} />
			<Button
				disabled={isFetching || isLoading}
				variant="link"
				className="border border-muted p-0 d-flex justify-content-center align-items-center"
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