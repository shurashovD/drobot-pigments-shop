import { FC } from "react"
import { Accordion, Button, Col, ListGroup, Row } from "react-bootstrap"
import { IPromocodeDetails } from "../../../../shared"
import { useAppDispatch } from "../../../application/hooks"
import { useDeletePromocodeMutation } from "../../../application/profile.service"
import { editPromocode } from "../../../application/profilePromocodesSlice"

interface IProps {
    promocode: IPromocodeDetails,
	created: boolean
}

const PromocodeItem: FC<IProps> = ({ promocode, created }) => {
    const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: '2-digit', year: '2-digit' })
	const [remove, { isLoading }] = useDeletePromocodeMutation()
	const dispatch = useAppDispatch()

    return (
		<Accordion.Item eventKey={promocode.id} className="border-dark px-0">
			<Row className={`m-0 w-100 ${created && "createdPromocode"}`}>
				<Col className="d-flex align-items-center" xs={6} lg={5}>
					<small>
						{promocode.code} c {formatter.format(new Date(promocode.dateStart))} по {formatter.format(new Date(promocode.dateFinish))}
					</small>
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
				<Col className="d-flex align-items-center justify-content-end ms-auto p-0" xs={3} lg={4}>
					{promocode.status === "created" ? (
						<Row xs={2} className="m-0 my-2">
							<Col>
								<Button variant="link" className="m-0 p-0" onClick={() => dispatch(editPromocode(promocode))}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M4.06519 17.3173L3.78019 19.8335C3.77357 19.8898 3.77978 19.9468 3.79836 20.0003C3.81694 20.0538 3.8474 20.1025 3.88746 20.1425C3.92751 20.1826 3.97612 20.213 4.02964 20.2316C4.08315 20.2502 4.14018 20.2564 4.19644 20.2498L6.69769 19.961C6.78159 19.9507 6.85955 19.9124 6.91894 19.8523L20.0027 6.72728C20.0724 6.65762 20.1277 6.57491 20.1655 6.48386C20.2032 6.39281 20.2227 6.29521 20.2227 6.19665C20.2227 6.09809 20.2032 6.0005 20.1655 5.90945C20.1277 5.8184 20.0724 5.73568 20.0027 5.66603L18.3189 3.97478C18.2492 3.90448 18.1663 3.84869 18.0749 3.81061C17.9835 3.77253 17.8855 3.75293 17.7864 3.75293C17.6874 3.75293 17.5894 3.77253 17.498 3.81061C17.4066 3.84869 17.3237 3.90448 17.2539 3.97478L4.17394 17.0998C4.11454 17.1582 4.07628 17.2347 4.06519 17.3173V17.3173Z"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
										<path d="M15.4919 5.74121L18.2031 8.53121" stroke="#AB9A9A" strokeWidth="0.8" />
									</svg>
								</Button>
							</Col>
							<Col>
								<Button variant="link" className="m-0 p-0" disabled={isLoading} onClick={() => remove({ id: promocode.id })}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M17.0586 20.5762H6.93359C6.83414 20.5762 6.73876 20.5367 6.66843 20.4663C6.5981 20.396 6.55859 20.3006 6.55859 20.2012L5.80859 6.70117H18.1723L17.4223 20.2012C17.4224 20.2987 17.3844 20.3924 17.3165 20.4624C17.2486 20.5324 17.1561 20.5732 17.0586 20.5762Z"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
										<path
											d="M19.125 6.69764H4.875C4.77 6.69764 4.6875 6.63764 4.6875 6.56639L5.03625 4.93514C5.05133 4.89878 5.07769 4.86822 5.11144 4.84796C5.1452 4.82771 5.18457 4.81883 5.22375 4.82264H18.7762C18.8154 4.81883 18.8548 4.82771 18.8886 4.84796C18.9223 4.86822 18.9487 4.89878 18.9637 4.93514L19.3125 6.56639C19.3125 6.63764 19.23 6.69764 19.125 6.69764Z"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
										<path d="M9 8.79004V18.165" stroke="#AB9A9A" strokeWidth="0.8" />
										<path d="M12 8.79004V18.165" stroke="#AB9A9A" strokeWidth="0.8" />
										<path d="M15 8.79004V18.165" stroke="#AB9A9A" strokeWidth="0.8" />
										<path
											d="M9.64844 4.82262V2.83887C9.64844 2.73941 9.68795 2.64403 9.75827 2.5737C9.8286 2.50338 9.92398 2.46387 10.0234 2.46387H13.9759C14.0754 2.46387 14.1708 2.50338 14.2411 2.5737C14.3114 2.64403 14.3509 2.73941 14.3509 2.83887V4.82262"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
									</svg>
								</Button>
							</Col>
						</Row>
					) : (
						<Accordion.Header className="m-0 p-0">
							<div className="text-uppercase text-dark me-3">
								<span className="d-none d-lg-block">Кэшбэк</span>
								{promocode.total.totalCashBack}P
							</div>
						</Accordion.Header>
					)}
				</Col>
			</Row>
			<Accordion.Body>
				<ListGroup variant="flush" className="bg-transparent p-0">
					{promocode.orders.map((item, index) => (
						<ListGroup.Item key={`${promocode.id}_${index}`} className="bg-transparent p-0 m-0">
							<Row className="w-100 text-muted">
								<Col className="d-flex align-items-center" xs={6} lg={5}>
									{item.buyer}
								</Col>
								<Col xs={3} lg={2}>{item.orderTotal}</Col>
								<Col className="d-flex align-items-center justify-content-end ms-auto" xs={3}>
									{item.orderCashBack}P
								</Col>
							</Row>
						</ListGroup.Item>
					))}
					<ListGroup.Item className="bg-transparent p-0 m-0">
						<Row className="w-100">
							<Col className="d-flex align-items-center" xs={6} lg={5}>
								Всего заказов {promocode.orders.length}
							</Col>
							<Col xs={3} lg={2} className="text-center">{promocode.total.ordersTotal}P</Col>
							<Col className="d-flex align-items-center justify-content-end ms-auto text-center" xs={3} lg={4}>
								{promocode.total.totalCashBack}P
							</Col>
						</Row>
					</ListGroup.Item>
				</ListGroup>
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default PromocodeItem