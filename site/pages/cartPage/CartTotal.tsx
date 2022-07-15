import { FC, useRef, useState } from "react"
import { Col, Fade, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAppSelector } from "../../application/hooks"

interface IProps {
	total?: number
}

const CartTotal: FC<IProps> = ({ total }) => {
	const noChecked = useAppSelector(
		(state) =>
			state.cartSlice.products.every(({ checked }) => !checked) &&
			state.cartSlice.variants.every(({ checked }) => !checked)
	)
	const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
		})
	)

    return (
		<div className="sticky-lg-top" style={{ top: "120px" }}>
			<Row className="p-4 pb-5 mb-5 border border-primary mx-0">
				<Col xs={8}>
					<div className="fs-3 text-uppercse mb-2">Итого</div>
					<div className="text-muted mb-2">Товары</div>
				</Col>
				<Col xs={4}>
					<div className="fs-3 text-uppercse mb-2">
						{typeof total !== "undefined" && (
							<>{formatter.current.format(total / 100)}</>
						)}
					</div>
					<div className="text-muted mb-2">
						{typeof total !== "undefined" && (
							<>{formatter.current.format(total / 100)}</>
						)}
					</div>
				</Col>
			</Row>
			<Row className="justify-content-center mx-0">
				<Col xs={12} md={10} className="text-center">
					<Fade in={!noChecked}>
						<NavLink className="btn btn-primary" to="/order">
							К оформлению
						</NavLink>
					</Fade>
				</Col>
			</Row>
		</div>
	)
}

export default CartTotal