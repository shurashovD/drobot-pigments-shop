import { Button, Col, Row } from "react-bootstrap"
import { FC } from "react"
import { ButtonProps } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import IconCart from "../icons/IconCart"
import { addToCart } from "../../application/cartSlice"

interface IProps extends ButtonProps {
    productId: string
}

const ButtonCart: FC<IProps> = (props) => {
    const quantity = useAppSelector(
		(state) =>
			state.cartSlice.products.find(
				({ productId }) => productId === props.productId
			)?.quantity
	)
    const dispatch = useAppDispatch()

	const addHandler = () => {
		if (quantity) return
		dispatch(addToCart(props.productId))
	}

    return (
		<Button
			variant={quantity ? "white" : "primary"}
			className={`${quantity && "border border-primary"} px-md-0 d-flex justify-content-center align-items-center w-100`}
			style={{ maxWidth: "264px" }}
			onClick={addHandler}
		>
			<Row className="g-0 m-0 w-100">
				<Col xs={3}>
					<div className={`${quantity ? "invisible" : "visible"} p-0 m-0 text-end`}>
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
	)
}

export default ButtonCart