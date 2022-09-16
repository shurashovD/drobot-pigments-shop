import { useRef } from "react"
import { Button, Col, Collapse, Fade, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAccountAuthQuery } from "../../application/account.service"
import { useAppDispatch } from "../../application/hooks"
import { useGetCartQuery } from "../../application/order.service"
import { setShowAuthModal } from "../../application/profileSlice"
import CashBackComponent from "./CashBackComponent"
import PromocodeComponent from "./PromocodeComponent"

const CartTotal = () => {
	const { data: auth } = useAccountAuthQuery(undefined)
	const { data: cart, isFetching } = useGetCartQuery(undefined, { refetchOnMountOrArgChange: true })
	const dispatch = useAppDispatch()
	const formatter = useRef(
		Intl.NumberFormat("ru", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
		})
	)

    return (
		<div className="sticky-lg-top" style={{ top: "120px" }}>
			<Collapse in={!!cart?.total}>
				<div className="p-4 pb-5 mb-4 border border-primary mx-0">
					<Fade in={!!cart?.total && !isFetching}>
						<Row className="mb-3">
							<Col xs={8} className="fs-3 text-uppercse">
								Итого
							</Col>
							<Col xs={4} className="fs-3 text-uppercse">
								{formatter.current.format(cart?.total || 0)}
							</Col>
						</Row>
					</Fade>
					<Fade in={!!cart?.amount && !isFetching}>
						<Row className="mb-2 text-muted">
							<Col xs={8}>Товары</Col>
							<Col xs={4}>{formatter.current.format(cart?.amount || 0)}</Col>
						</Row>
					</Fade>
					<Fade in={!!cart?.discount && !isFetching}>
						<Row className="mb-2 text-danger">
							<Col xs={8}>Скидка</Col>
							<Col xs={4}>-{formatter.current.format(cart?.discount || 0)}</Col>
						</Row>
					</Fade>
					<Fade in={!!cart?.useCashBack && !isFetching}>
						<Row className="mb-2 text-danger">
							<Col xs={8}>Кэшбэк</Col>
							<Col xs={4}>-{formatter.current.format(cart?.availableCashBack || 0)}</Col>
						</Row>
					</Fade>
				</div>
			</Collapse>
			{!auth && (
				<div className="mb-5">
					Для доступа к скидкам{" "}
					<Button variant="link" onClick={() => dispatch(setShowAuthModal(true))} className="m-0 p-0 text-dark text-decoration-underline">
						Авторизуйтесь или Зарестирируйтесь
					</Button>
				</div>
			)}
			{!!auth && !auth.status && (
				<div className="mb-5">
					Для доступа к скидкам{" "}
					<NavLink to="/profile#profile" className="text-decorarion-underline text-dark">
						завершите регистрацию
					</NavLink>
				</div>
			)}
			{auth?.status === "common" && (
				<Fade in={!!cart?.total && !isFetching}>
					<div className="mb-5">
						<PromocodeComponent />
					</div>
				</Fade>
			)}
			{(auth?.status === "agent" || auth?.status === "delegate") && cart?.availableCashBack && cart.availableCashBack > 0 && (
				<Fade in={!!cart?.total && !isFetching}>
					<div className="mb-5">
						<CashBackComponent />
					</div>
				</Fade>
			)}
			<Row className="justify-content-center mx-0">
				<Col xs={12} md={10} className="text-center">
					<Fade in={!isFetching && !!cart?.total}>
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