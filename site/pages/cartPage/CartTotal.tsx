import { FC, useRef, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useAppSelector } from "../../application/hooks"
import ButtonComponent from "../../components/ButtonComponent"
import SignOrderModal from "./SignOrderModal"

interface IProps {
	isLoading: boolean
	total?: number
}

const CartTotal: FC<IProps> = ({ isLoading, total }) => {
	const [show, setShow] = useState(false)
	const noChecked = useAppSelector(state => state.cartSlice.products.every(({ checked }) => !checked))
	const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 2,
		})
	)

    return (
		<div className="sticky-lg-top" style={{ top: "120px" }}>
			<SignOrderModal
				onHide={() => setShow(false)}
				show={show}
			/>
			<Row className="p-4 pb-5 mb-5 border border-primary mx-0">
				<Col xs={8}>
					<div className="fs-3 text-uppercse mb-2">Итого</div>
					<div className="text-muted mb-2">Товары, 2 шт</div>
				</Col>
				<Col xs={4}>
					<div className="fs-3 text-uppercse mb-2">
						{typeof total !== "undefined" && (
							<>{formatter.current.format(total)}</>
						)}
					</div>
					<div className="text-muted mb-2">
						{typeof total !== "undefined" && (
							<>{formatter.current.format(total)}</>
						)}
					</div>
				</Col>
			</Row>
			<Row className="justify-content-center mx-0">
				<Col xs={12} md={10} className="text-center">
					<ButtonComponent
						isLoading={isLoading}
						onClick={() => setShow(true)}
						disabled={noChecked}
					>
						К оформлению
					</ButtonComponent>
				</Col>
			</Row>
		</div>
	)
}

export default CartTotal