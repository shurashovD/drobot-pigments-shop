import { FC } from "react"
import { Button, ButtonProps, Col, Row } from "react-bootstrap"
import { useAppSelector } from "../../application/hooks"
import { useChangeProductInCartMutation, useChangeVariantInCartMutation } from "../../application/order.service"
import IconCart from "../../components/icons/IconCart"

interface IProps extends ButtonProps {
    productId: string
    variantId?: string
}

const ToCartBtn: FC<IProps> = ({ disabled, productId, variantId }) => {
    const inCart = useAppSelector(state => (
        state.cartSlice.products.some(item => item.productId === productId) ||
        state.cartSlice.variants.some(item => item.variantId === variantId)
    ))
    const [changeProduct, { isLoading: addProductLoading }] = useChangeProductInCartMutation()
    const [changeVariant, { isLoading: addVariantLoading }] = useChangeVariantInCartMutation()

    const handler = () => {
        if (variantId) {
			changeVariant({ productId, variantId, quantity: 1 })
		} else {
            changeProduct({ productId, quantity: 1 })
        }
    }

    return (
		<Button
			disabled={
				disabled || addProductLoading || addVariantLoading || inCart
			}
			variant={inCart ? "white" : "primary"}
			className={`${
				inCart && "border border-primary"
			} px-md-0 d-flex justify-content-center align-items-center w-100`}
			style={{ maxWidth: "264px", minWidth: "210px" }}
			onClick={handler}
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
	)
}

export default ToCartBtn