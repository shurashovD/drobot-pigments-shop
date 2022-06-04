import { Button, Col, Row } from "react-bootstrap"
import { FC } from "react"
import { ButtonProps } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import IconCart from "../icons/IconCart"

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

    return (
		<Button
			variant="primary"
			className="px-0 border border-dark d-flex justify-content-center align-items-center w-100"
		>
			<Row>
				<Col xs={"auto"}>
					<IconCart stroke="#141515" width={22} height={27} />
				</Col>
				<Col xs={"auto"} className="d-flex">
					<span className="text-uppercase m-auto">В корзину</span>
				</Col>
				<Col xs={"auto"}></Col>
			</Row>
		</Button>
	)
}

export default ButtonCart