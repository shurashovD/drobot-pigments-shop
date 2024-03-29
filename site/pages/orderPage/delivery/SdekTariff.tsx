import classNames from "classnames"
import { Button, Col, Fade, Form, Row } from "react-bootstrap"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"
import RadioComponent from "../../../components/RadioComponent"

const SdekTariff = () => {
    const { data, isFetching } = useGetDeliveryDetailQuery(undefined)
    const [setDetail, { isLoading }] = useSetDeliveryDetailMutation()
	let formatter = null
	try {
		formatter = new Intl.NumberFormat("ru", {
			style: "unit",
			unit: "day",
			notation: "standard",
		})
	} catch (e) {}

    const handler = (tariff_code: number) => {
		setDetail({ pickup: false, sdek: true, tariff_code })
	}

    return (
		<div className={classNames("border px-4 py-3 h-100", { "border-secondary": data?.sdek })}>
			<Button variant="link" className="m-0 p-0 mb-3">
				СДЭК
			</Button>
			<Row className="justify-content-between mb-3 g-2">
				<Col xs="auto">
					<Form.Label className="d-flex mb-2 mb-md-0">
						<RadioComponent
							isLoading={isLoading || isFetching}
							checked={!isLoading && !isFetching && (data?.tariff_code === 138 || data?.tariff_code === 366)}
							onChange={() => handler(138)}
							disabled={isLoading || isFetching}
						/>
						<span className="text-muted ms-1">Доставка до ПВЗ СДЭК</span>
					</Form.Label>
				</Col>
				<Col xs="auto">
					<Form.Label className="d-flex mb-0">
						<RadioComponent
							isLoading={isLoading || isFetching}
							checked={!isLoading && !isFetching && data?.tariff_code === 139}
							onChange={() => handler(139)}
							disabled={isLoading}
						/>
						<span className="text-muted ms-1">Доставка курьером до адреса</span>
					</Form.Label>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Fade in={(!!data?.total_sum || data?.total_sum === 0) && !isFetching && !isLoading}>
						<div>
							{data?.total_sum} руб.,{" "}
							{data?.period_max && (
								<span>
									{data?.period_min}
									{formatter && <>-{formatter.format(data.period_max)}</>}
								</span>
							)}
						</div>
					</Fade>
				</Col>
			</Row>
		</div>
	)
}

export default SdekTariff