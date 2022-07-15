import { FC, useEffect, useState } from "react"
import { Button, Col, Modal, ModalProps, Row, Spinner } from "react-bootstrap"
import { useGetPointsQuery, useSetDeliveryDetailMutation } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
const reactYandexMaps = require('react-yandex-maps')

interface IProps extends ModalProps {}

const PointModal: FC<IProps> = (props) => {
    const [checked, setChecked] = useState<undefined | string>()
    const [setPoint, { isLoading, isSuccess }] = useSetDeliveryDetailMutation()
    const { data, isLoading: pvzLoading } = useGetPointsQuery(undefined, { refetchOnMountOrArgChange: true })

	const { YMaps, Map, Placemark } = reactYandexMaps

    const handler = () => {
        const point = data?.find(({ code }) => code === checked)
        if ( point ) {
            setPoint({ sdek: true, tariff_code: point.type === 'POSTAMAT' ? 366 : 138, code: point.code })
        }
    }

    const onHide = () => {
        setChecked(undefined)
        if ( props.onHide ) {
            props.onHide()
        }
    }

    const clickHandler = (event: any) => {
        const pvzName = event.originalEvent.target.properties._data.hintContent
		const code = data?.find(({ name }) => name === pvzName)?.code
		if ( code ) {
			setChecked(code)
		}
    }

    useEffect(() => {
        if ( isSuccess && props.onHide ) {
            props.onHide()
        }
    }, [isSuccess])

    return (
		<Modal show={props.show} onHide={onHide} size="lg">
			<Modal.Body className="bg-primary">
				<Modal.Header
					closeButton
					closeVariant="white"
					className="border-0"
				/>
				{pvzLoading && (
					<div className="text-center">
						<Spinner animation="border" />
					</div>
				)}
				{data && (
					<Row>
						<Col
							xs={12}
							lg={4}
							style={{ overflow: "scroll", maxHeight: "50vh" }}
						>
							{data.map(({ code, location }) => (
								<Button
									onClick={() => setChecked(code)}
									key={code}
									className={`text-center ${checked === code ? 'active' : "false"}`}
								>
									{location.address}
								</Button>
							))}
						</Col>
						<Col xs={12} lg={8} style={{ overflow: 'hidden' }}>
							<YMaps>
								<Map
									state={{
										center: [
											data.reduce(
												(sum, { location }) =>
													sum + location.latitude,
												0
											) / data.length,
											data.reduce(
												(sum, { location }) =>
													sum + location.longitude,
												0
											) / data.length,
										],
										zoom: 11,
										width: 320,
									}}
								>
									{data.map(({ location, code, name }) => (
										<Placemark
											key={code}
											geometry={{
												coordinates: [
													location.latitude,
													location.longitude,
												],
											}}
											properties={{
												hintContent: name,
												balloonContent: name,
											}}
											onClick={clickHandler}
										/>
									))}
								</Map>
							</YMaps>
						</Col>
					</Row>
				)}
				<Row className="justify-content-end">
					<Col xs="auto">
						<ButtonComponent
							disabled={!checked}
							onClick={handler}
							isLoading={isLoading}
							variant="secondary"
						>
							OK
						</ButtonComponent>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	)
}

export default PointModal