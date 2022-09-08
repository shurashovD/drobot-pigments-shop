import { Button, Col, Row } from "react-bootstrap"
import { FC, useEffect, useState } from "react"
import { ButtonProps } from "react-bootstrap"
import IconCart from "../icons/IconCart"
import { useChangeProductInCartMutation, useChangeVariantInCartMutation, useGetCartQuery } from "../../application/order.service"

interface IProps extends ButtonProps {
    productId: string
	variantId?: string
}

const ButtonCart: FC<IProps> = ({ productId, variantId }) => {
	const { data: cart, isFetching } = useGetCartQuery(undefined)
	const [inCart, setInCart] = useState(false)
	const [addProductToCart, { isLoading: addProductLoading }] = useChangeProductInCartMutation()
	const [addVariantToCart, { isLoading: addVariantLoading }] = useChangeVariantInCartMutation()

	const addProductHandler = () => {
		if (variantId) {
			addVariantToCart({ productId, variantId, quantity: 1 })
		} else {
			addProductToCart({ productId, quantity: 1 })
		}
	}

	useEffect(() => {
		if ( cart ) {
			if ( variantId ) {
				setInCart(cart.variants.some((item) => item.variantId === variantId))
			} else {
				setInCart(cart.products.some(product => (product.productId === productId)))
			}
		}
	}, [cart, productId, variantId])

    return (
		<div className="w-100">
			<Button
				disabled={isFetching || addProductLoading || addVariantLoading || inCart}
				variant={inCart ? "white" : "primary"}
				className={`${
					inCart && "border border-primary"
				} px-md-0 d-flex justify-content-center align-items-center w-100`}
				style={{ maxWidth: "264px", minWidth: "210px" }}
				onClick={addProductHandler}
			>
				<Row className="g-0 m-0 w-100">
					<Col xs={3}>
						<div
							className={`${
								inCart ? "invisible" : "visible"
							} p-0 m-0 text-end`}
						>
							<IconCart stroke="#F7DFB1" width={22} height={27} />
						</div>
					</Col>
					<Col xs={6} className="d-flex">
						<span className="text-uppercase m-auto">
							В корзин{inCart ? <>е</> : <>у</>}
						</span>
					</Col>
				</Row>
			</Button>
		</div>
	)
}

export default ButtonCart