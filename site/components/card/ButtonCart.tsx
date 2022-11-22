import { Button } from "react-bootstrap"
import { FC, useEffect, useState } from "react"
import { ButtonProps } from "react-bootstrap"
import IconCart from "../icons/IconCart"
import classnames from 'classnames'
import { useChangeProductInCartMutation, useChangeVariantInCartMutation, useGetCartQuery } from "../../application/order.service"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../application/hooks"
import { addCartToast } from "../../application/toastSlice"

interface IProps extends ButtonProps {
    productId: string
	variantId?: string
}

const ButtonCart: FC<IProps> = ({ productId, variantId }) => {
	const { data: cart, isFetching } = useGetCartQuery(undefined)
	const [inCart, setInCart] = useState(false)
	const [
		addProductToCart, { isLoading: addProductLoading, isSuccess: addProductSuccess, reset: addProductReset }
	] = useChangeProductInCartMutation()
	const [
		addVariantToCart, { isLoading: addVariantLoading, isSuccess: addVariantSuccess, reset: addVariantReset }
	] = useChangeVariantInCartMutation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const addProductHandler = () => {
		if ( inCart ) {
			navigate('/cart')
			return
		}
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

	useEffect(() => {
		if ( addProductSuccess || addVariantSuccess ) {
			dispatch(addCartToast())
			addProductReset()
			addVariantReset()
		}
	}, [addProductSuccess, addProductReset, addVariantSuccess, addVariantReset, dispatch, addCartToast])

    return (
		<Button
			disabled={isFetching || addProductLoading || addVariantLoading}
			variant="link"
			className={classnames("p-0 px-2 d-flex justify-content-center align-items-center to-cart__btn", { "in-cart": inCart })}
			style={{ maxWidth: "264px", minHeight: "45px" }}
			onClick={addProductHandler}
		>
			<span className="me-lg-2 d-lg-none">
				<IconCart stroke={inCart ? "#52372D" : "#F7DFB1"} width={22} height={27} strokeWidth={0.7} />
			</span>
			<span className={classnames({ invisible: inCart }, "me-lg-2 d-none d-lg-block")}>
				<IconCart stroke={inCart ? "#52372D" : "#F7DFB1"} width={22} height={27} strokeWidth={0.7} />
			</span>
			<span className="text-uppercase d-none d-lg-block" style={{ transform: `translateX(${inCart ? "-16px" : "0"})` }}>
				В корзин{inCart ? <>е</> : <>у</>}
			</span>
		</Button>
	)
}

export default ButtonCart