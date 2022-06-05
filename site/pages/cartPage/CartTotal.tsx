import { Button, Col, Row } from "react-bootstrap"

const CartTotal = () => {
    return (
		<div className="sticky-lg-top" style={{ top: '120px' }}>
			<Row className="p-4 pb-5 mb-5 border border-primary mx-0">
				<Col xs={8}>
					<div className="fs-3 text-uppercse mb-2">Итого</div>
					<div className="text-muted mb-2">Товары, 2 шт</div>
				</Col>
				<Col xs={4}>
					<div className="fs-3 text-uppercse mb-2">30000</div>
					<div className="text-muted mb-2">30000</div>
				</Col>
			</Row>
			<Row className="justify-content-center mx-0">
				<Col xs={12} md={10} className="text-center">
					<Button className="text-uppercase w-100">
						К оформлению
					</Button>
				</Col>
			</Row>
		</div>
	)
}

export default CartTotal