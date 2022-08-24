import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useChangeProductInCartMutation, useGetCartQuery } from "../../application/order.service"

interface IProps {
	productId: string
}

const ProductCounter: FC<IProps> = ({ productId }) => {
	const { data: cart, isFetching } = useGetCartQuery(undefined)
	const [quantity, setQuantity] = useState(0)
	const [changeProduct, { isLoading }] = useChangeProductInCartMutation()

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if (isFetching || isLoading) return
        const { value } = event.target
        if ( isNaN(parseInt(value)) ) return
        changeProduct({ productId, quantity: parseInt(value) })
    }

	const handlerInc = () => {
		changeProduct({ productId, quantity: quantity + 1 })
	}

	const handlerDec = () => {
		changeProduct({ productId, quantity: Math.max(quantity - 1, 0) })
	}

	useEffect(() => {
		if (cart) {
			const quantity = cart.variants.find((item) => item.productId === productId)?.quantity || 0
			setQuantity(quantity)
		}
	}, [cart, productId])

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
			<Form.Control disabled={isFetching || isLoading} className="border-0 text-center p-0" value={quantity} onChange={inputHandler} />
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

export default ProductCounter