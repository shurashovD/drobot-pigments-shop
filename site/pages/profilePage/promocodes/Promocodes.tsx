import { Col, Container, Row, Spinner } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useGetPromocodesQuery } from "../../../application/profile.service"

const Promocodes = () => {
	const { data, isLoading } = useGetPromocodesQuery()
	const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'numeric', year: '2-digit' })

	return (
		<Container fluid="sm">
			<Row>
				<Col xs={12} lg={7}>
					{!data && isLoading && (
						<div className="text-center p-3">
							<Spinner variant="secondary" animation="border" />
						</div>
					)}
					{data && !isLoading && data.length === 0 && <div className="text-center text-muted">У Вас еще нет промокодов</div>}
					{data?.map((promocode) => (
						<Row className="m-0 w-100 mb-2" key={promocode._id.toString()}>
							<Col className="d-flex flex-column justify-content-center align-items-center" xs={6} lg={3}>
								<NavLink to={`/promocode/${promocode._id.toString()}`} className="text-dark">
									{promocode.code}
								</NavLink>
								<small className="d-lg-none">
									({formatter.format(new Date(promocode.dateStart))} - {formatter.format(new Date(promocode.dateFinish))})
								</small>
							</Col>
							<Col className="d-none d-lg-flex align-items-center" xs={0} lg={3}>
								{formatter.format(new Date(promocode.dateStart))} - {formatter.format(new Date(promocode.dateFinish))}
							</Col>
							<Col className="d-flex align-items-center" xs={3}>
								{promocode.status === "created" && (
									<div className="bg-dark text-white p-1 p-lg-3 py-1 text-uppercase mb-1">
										<small>Скоро</small>
									</div>
								)}
								{promocode.status === "finished" && (
									<div className="text-white p-1 p-lg-3 py-1 text-uppercase" style={{ backgroundColor: "#ab9a9a" }}>
										<small>Завершен</small>
									</div>
								)}
								{promocode.status === "stopped" && (
									<div className="text-white p-1 p-lg-3 py-1 text-uppercase" style={{ backgroundColor: "#ab9a9a" }}>
										<small>Отменён</small>
									</div>
								)}
								{promocode.status === "running" && (
									<div className="text-primary p-1 p-lg-3 py-1 text-uppercase" style={{ backgroundColor: "#58FF3D" }}>
										<small>Активный</small>
									</div>
								)}
							</Col>
							<Col className="text-uppercase d-flex align-items-center" xs={3}>
								<NavLink to={`/promocode/${promocode._id.toString()}`} className="w-100 text-dark text-center">
									{promocode.promocodeTotalCashBack}P
								</NavLink>
							</Col>
						</Row>
					))}
				</Col>
			</Row>
		</Container>
	)
}

export default Promocodes