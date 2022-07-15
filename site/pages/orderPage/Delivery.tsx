import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Col, Fade, Form, Row } from "react-bootstrap"
import { useSetDeliveryDetailMutation } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
import PointModal from "./PointModal"

interface IProps {
	busy?: boolean
	tariff_code?: number
	sdek?: boolean
	address?: string
	code?: string
	period_max?: number
	period_min?: number
	total_sum?: number
}

const Delivery: FC<IProps> = (props) => {
    const { address, tariff_code } = props
    const [value, setValue] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [setDetail, { isLoading }] = useSetDeliveryDetailMutation()

    const handler = (event: ChangeEvent<HTMLInputElement>) => {
        const tariff_code = event.target.dataset.tariff
        if ( tariff_code && !isNaN(parseInt(tariff_code))) {
			setDetail({ sdek: true, tariff_code: parseInt(tariff_code) })
		}
    }

	const addressHandler = () => {
		setDetail({ sdek: true, tariff_code: 139, address: value })
	}

    useEffect(() => {
        if ( tariff_code === 138 || tariff_code === 366 ) {

        }
    }, [tariff_code])

	useEffect(() => {
		if ( address ) {
			setValue(address)
		}
	}, [address])

    return (
		<Row>
			<PointModal show={showModal} onHide={() => setShowModal(false)} />
			<Col lg={6}>
				<div className="border border-secondary px-4 py-3">
					<Button variant="link" className="m-0 p-0 mb-3">
						СДЭК
					</Button>
					<Row className="justify-content-between mb-3">
						<Col xs="auto">
							<Form.Label className="d-flex mb-0">
								<Form.Check
									type="radio"
									checked={
										!isLoading &&
										!props.busy &&
										(props.tariff_code === 138 ||
											props.tariff_code === 366)
									}
									onChange={handler}
									disabled={isLoading}
									data-tariff={138}
								/>
								<span className="text-muted ms-1">
									Самовывоз
								</span>
							</Form.Label>
						</Col>
						<Col xs="auto">
							<Form.Label className="d-flex mb-0">
								<Form.Check
									type="radio"
									checked={
										!isLoading &&
										!props.busy &&
										props.tariff_code === 139
									}
									onChange={handler}
									disabled={isLoading}
									data-tariff={139}
								/>
								<span className="text-muted ms-1">
									Доставка курьером
								</span>
							</Form.Label>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<Fade
								in={
									!!props.total_sum &&
									!props.busy &&
									!isLoading
								}
							>
								<div>
									{props.total_sum} руб., {props.period_min}-
									{props.period_max} дней
								</div>
							</Fade>
						</Col>
					</Row>
				</div>
			</Col>
			<Col lg={6} />
			<Fade in={!props.busy}>
				<Col lg={12} className="mt-5 mb-4">
					{props.tariff_code === 139 && (
						<Row>
							<Col xs={12} md={10} lg={8}>
								<Form.Control
									value={value}
									onChange={(
										e: ChangeEvent<HTMLInputElement>
									) => setValue(e.target.value)}
									placeholder="Адрес без города"
									className="h-100"
								/>
							</Col>
							<Col xs={12} md={2}>
								<ButtonComponent
									onClick={addressHandler}
									isLoading={isLoading}
									disabled={
										value === "" || value === props.address
									}
								>
									Далее
								</ButtonComponent>
							</Col>
						</Row>
					)}
					{(props.tariff_code === 138 || props.tariff_code === 366) &&
						props.address && (
							<div className="mb-4">
								Выбрано:{" "}
								<b className="text-primary">{props.address}</b>
							</div>
						)}
					{(props.tariff_code === 138 || props.tariff_code === 366) &&
						props.code && (
							<Button
								variant="outline-primary"
								onClick={() => setShowModal(true)}
							>
								Изменить пункт выдачи
							</Button>
						)}
					{(props.tariff_code === 138 || props.tariff_code === 366) &&
						!props.code && (
							<Button
								variant="secondary"
								onClick={() => setShowModal(true)}
							>
								Выбрать пункт выдачи
							</Button>
						)}
				</Col>
			</Fade>
		</Row>
	)
}

export default Delivery