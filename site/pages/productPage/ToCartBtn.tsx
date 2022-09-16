import { FC, useEffect, useState } from "react"
import { Button, ButtonProps } from "react-bootstrap"
import { useChangeProductInCartMutation, useChangeVariantInCartMutation, useGetCartQuery } from "../../application/order.service"
import IconCart from "../../components/icons/IconCart"
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'

interface IProps extends ButtonProps {
    productId: string
    variantId?: string
}

const ToCartBtn: FC<IProps> = ({ disabled, productId, variantId }) => {
	const { data: cart, isFetching } = useGetCartQuery(undefined)
    const [inCart, setInCart] = useState(false)
    const [changeProduct, { isLoading: addProductLoading }] = useChangeProductInCartMutation()
    const [changeVariant, { isLoading: addVariantLoading }] = useChangeVariantInCartMutation()
	const navigate = useNavigate()

    const handler = () => {
		if (inCart) {
			navigate("/cart")
			return
		}
        if (variantId) {
			changeVariant({ productId, variantId, quantity: 1 })
		} else {
            changeProduct({ productId, quantity: 1 })
        }
    }

	useEffect(() => {
		if ( cart ) {
			setInCart(
				cart.products.some(item => (productId === item.productId)) ||
				cart.variants.some(item => (variantId === item.variantId))
			)
		}
	}, [cart, productId, variantId])

    return (
		<Button
			disabled={disabled || addProductLoading || addVariantLoading || isFetching}
			variant="link"
			className={classnames("p-0 px-2 d-flex justify-content-center align-items-center to-cart__btn", { "in-cart": inCart })}
			style={{ maxWidth: "264px", minHeight: "45px" }}
			onClick={handler}
		>
			<span className={classnames({ invisible: inCart }, "me-1 me-md-2")}>
				<IconCart stroke="#F7DFB1" width={22} height={27} strokeWidth={0.7} />
			</span>
			<span className="text-uppercase" style={{ transform: `translateX(${inCart ? "-16px" : "0"})` }}>
				В корзин{inCart ? <>е</> : <>у</>}
			</span>
		</Button>
	)
}

export default ToCartBtn