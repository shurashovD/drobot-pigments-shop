import { Button, Col, Overlay, OverlayTrigger, Popover, Row } from "react-bootstrap"
import { FC, useEffect, useRef, useState } from "react"
import { ButtonProps } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import IconCart from "../icons/IconCart"
import { addToCart, addVariantToCart } from "../../application/cartSlice"
import { Product } from "../../../shared"

interface IProps extends ButtonProps {
    productId: string
	variantsLabel?: string
	variants?: Product['variants']
}

const ButtonCart: FC<IProps> = (props) => {
	const overlayTarget = useRef<HTMLButtonElement | null>(null)
	const [popoverShow, setPopoverShow] = useState(false)
    const quantity = useAppSelector(
		(state) =>
			state.cartSlice.products.find(
				({ productId }) => productId === props.productId
			)?.quantity
	)
	const variants = useAppSelector(state => props.variants?.map(({ id }) => {
		const inCart = state.cartSlice.variants.some(({ variantId }) => variantId === id)
		return { id, inCart }
	})?.filter(({ inCart }) => !inCart)?.map(({id}) => id) || [])
    const dispatch = useAppDispatch()

	const addHandler = () => {
		if (variants.length > 0) {
			setPopoverShow((state) => !state)
			return
		}
		if (quantity || (props.variants && props.variants.length > 0)) return
		dispatch(addToCart(props.productId))
	}

	useEffect(() => {
		if (popoverShow && variants.length === 0) {
			setPopoverShow(false)
		}
	}, [variants, popoverShow])

    return (
		<div>
			<Overlay target={overlayTarget} placement="top" show={popoverShow} onHide={() => setPopoverShow(false)} rootClose>
				<Popover>
					<Popover.Header>{props.variantsLabel}</Popover.Header>
					<Popover.Body>
						{props.variants
							?.filter(({ id }) =>
								variants.some((item) => item === id)
							)
							.map(({ id, value }) => (
								<Button
									variant="link"
									className="border border-gray me-1 p-2"
									key={id}
									onClick={() =>
										dispatch(
											addVariantToCart({
												productId: props.productId,
												variantId: id,
											})
										)
									}
								>
									{value}
								</Button>
							))}
					</Popover.Body>
				</Popover>
			</Overlay>
			<Button
				variant={quantity ? "white" : "primary"}
				className={`${
					quantity && "border border-primary"
				} px-md-0 d-flex justify-content-center align-items-center w-100`}
				style={{ maxWidth: "264px" }}
				onClick={addHandler}
				ref={overlayTarget}
			>
				<Row className="g-0 m-0 w-100">
					<Col xs={3}>
						<div
							className={`${
								quantity ? "invisible" : "visible"
							} p-0 m-0 text-end`}
						>
							<IconCart stroke="#F7DFB1" width={22} height={27} />
						</div>
					</Col>
					<Col xs={6} className="d-flex">
						<span className="text-uppercase m-auto">
							В корзин{quantity ? <>е</> : <>у</>}
						</span>
					</Col>
				</Row>
			</Button>
		</div>
	)
}

export default ButtonCart