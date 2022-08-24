import { ChangeEvent, useEffect, useState } from "react"
import { Button, Col, Fade, Form, Row } from "react-bootstrap"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
import PointModal from "./PointModal"

const Delivery = () => {
    const { data, isFetching } = useGetDeliveryDetailQuery(undefined)
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
		if (data?.address) {
			setValue(data.address)
		}
	}, [data])

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
									checked={!isLoading && !isFetching && (data?.tariff_code === 138 || data?.tariff_code === 366)}
									onChange={handler}
									disabled={isLoading || isFetching}
									data-tariff={138}
								/>
								<span className="text-muted ms-1">Самовывоз</span>
							</Form.Label>
						</Col>
						<Col xs="auto">
							<Form.Label className="d-flex mb-0">
								<Form.Check
									type="radio"
									checked={!isLoading && !isFetching && data?.tariff_code === 139}
									onChange={handler}
									disabled={isLoading}
									data-tariff={139}
								/>
								<span className="text-muted ms-1">Доставка курьером</span>
							</Form.Label>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<Fade in={!!data?.total_sum && !isFetching && !isLoading}>
								<div>
									{data?.total_sum} руб., {data?.period_min}-{data?.period_max} дней
								</div>
							</Fade>
						</Col>
					</Row>
				</div>
			</Col>
			<Col lg={6} />
			<Fade in={!isFetching && !!data}>
				<Col lg={12} className="mt-5 mb-4">
					{data?.tariff_code === 139 && (
						<Row>
							<Col xs={12} md={10} lg={8}>
								<Form.Control
									value={value}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
									placeholder="Адрес без города"
									className="h-100"
								/>
							</Col>
							<Col xs={12} md={2}>
								<ButtonComponent onClick={addressHandler} isLoading={isLoading} disabled={value === "" || value === data?.address}>
									Далее
								</ButtonComponent>
							</Col>
						</Row>
					)}
					{(data?.tariff_code === 138 || data?.tariff_code === 366) && data?.address && (
						<div className="mb-4">
							Выбрано: <b className="text-primary">{data?.address}</b>
						</div>
					)}
					{(data?.tariff_code === 138 || data?.tariff_code === 366) && data?.code && (
						<Button variant="outline-primary" onClick={() => setShowModal(true)}>
							Изменить пункт выдачи
						</Button>
					)}
					{(data?.tariff_code === 138 || data?.tariff_code === 366) && !data?.code && (
						<Button variant="secondary" onClick={() => setShowModal(true)}>
							Выбрать пункт выдачи
						</Button>
					)}
				</Col>
			</Fade>
		</Row>
	)
}

export default Delivery