import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Col, Form, Row, Tab } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import ButtonComponent from "../../../components/ButtonComponent"
import PvzList from "./PvzList"
import PvzMap from "./PvzMap"

const SdekDetail: FC = () => {
    const { data } = useGetDeliveryDetailQuery(undefined)
	const [setDetail, { isLoading, isSuccess }] = useSetDeliveryDetailMutation()
	const [value, setValue] = useState("")
    const [activeKey, setActivekey] = useState("1")
	const dispatch = useAppDispatch()

    const addressHandler = () => {
		setDetail({ sdek: true, tariff_code: 139, address: value })
	}

    useEffect(() => {
		if (data?.address) {
			setValue(data.address)
		}
	}, [data])

	useEffect(() => {
		if ( isSuccess ) {
			dispatch(setActive("3"))
		}
	}, [isSuccess])

    return (
		<div>
			{data?.tariff_code === 139 && (
				<Row className="g-2">
					<Col xs={12} md={10} lg={8}>
						<Form.Control
							value={value}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
							placeholder="Адрес без города"
							className="h-100"
						/>
					</Col>
					<Col xs="auto" md={2}>
						<ButtonComponent onClick={addressHandler} isLoading={isLoading} disabled={value === ""}>
							Выбрать
						</ButtonComponent>
					</Col>
				</Row>
			)}
			{(data?.tariff_code === 138 || data?.tariff_code === 366) && (
				<>
					<div className="mb-3">Выберите пункт выдачи</div>
					<Row className="d-none d-lg-flex">
						<Col xs={6}>
							<PvzList />
						</Col>
						<Col xs={6}>
							<div style={{ height: "40vh" }}>
								<PvzMap />
							</div>
						</Col>
					</Row>
					<div className="d-lg-none">
						<Tab.Container activeKey={activeKey}>
							<Row className="mb-3">
								<Col xs={6} className="text-center">
									<Button variant="link" size="sm" onClick={() => setActivekey("1")}>
										Список
									</Button>
								</Col>
								<Col xs={6} className="text-center">
									<Button variant="link" size="sm" onClick={() => setActivekey("2")}>
										Карта
									</Button>
								</Col>
							</Row>
							<Tab.Content>
								<Tab.Pane eventKey="1">
									<PvzList />
								</Tab.Pane>
								<Tab.Pane eventKey="2">
									<PvzMap />
								</Tab.Pane>
							</Tab.Content>
						</Tab.Container>
					</div>
				</>
			)}
		</div>
	)
}

export default SdekDetail