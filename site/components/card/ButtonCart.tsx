import { Button, Col, Overlay, Popover, Row } from "react-bootstrap"
import { FC, useEffect, useRef, useState } from "react"
import { ButtonProps } from "react-bootstrap"
import IconCart from "../icons/IconCart"
import { Product } from "../../../shared"
import { useChangeProductInCartMutation, useChangeVariantInCartMutation, useGetCartQuery } from "../../application/order.service"

interface IProps extends ButtonProps {
    productId: string
	variantsLabel?: string
	variants?: Product['variants']
}

const ButtonCart: FC<IProps> = ({ productId, variants, variantsLabel }) => {
	const { data: cart, isFetching } = useGetCartQuery(undefined)
	const [inCart, setInCart] = useState(false)
	const overlayTarget = useRef<HTMLButtonElement | null>(null)
	const [popoverShow, setPopoverShow] = useState(false)
	const [addProductToCart, { isLoading: addProductLoading }] = useChangeProductInCartMutation()
	const [addVariantToCart, { isLoading: addVariantLoading }] = useChangeVariantInCartMutation()

	const addProductHandler = () => {
		if (variantsLabel) {
			setPopoverShow(true)
		} else {
			addProductToCart({ productId, quantity: 1 })
		}
	}

	useEffect(() => {
		if ( cart ) {
			if (popoverShow && variants?.length === 0) {
				setPopoverShow(false)
			}
		} else {
			setPopoverShow(false)
		}
		
	}, [variants, popoverShow, cart])

	useEffect(() => {
		if ( cart ) {
			if ( variants ) {
				setInCart(variants.every((item) => (
					cart.variants.some(({ variantId }) => (variantId === item.id))
				)))
			} else {
				setInCart(cart.products.some(product => (product.productId === productId)))
			}
		}
	}, [cart, productId, variants])

    return (
		<div className="w-100">
			{variants && (
				<Overlay
					target={overlayTarget}
					placement="top"
					show={!inCart && popoverShow}
					onHide={() => setPopoverShow(false)}
					rootClose
				>
					<Popover>
						<Popover.Header>{variantsLabel}</Popover.Header>
						<Popover.Body>
							{variants.filter(({ id }) => !cart?.variants.some(({ variantId }) => variantId === id))
								.map(({ id, value }) => (
								<Button
									disabled={
										isFetching ||
										addProductLoading ||
										addVariantLoading
									}
									variant="link"
									className="border border-gray me-1 p-2"
									key={id}
									onClick={() => addVariantToCart({ productId, variantId: id, quantity: 1 })}
								>
									{value}
								</Button>
							))}
						</Popover.Body>
					</Popover>
				</Overlay>
			)}
			<Button
				disabled={isFetching || addProductLoading || addVariantLoading || inCart}
				variant={inCart ? "white" : "primary"}
				className={`${
					inCart && "border border-primary"
				} px-md-0 d-flex justify-content-center align-items-center w-100`}
				style={{ maxWidth: "264px", minWidth: "210px" }}
				onClick={addProductHandler}
				ref={overlayTarget}
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