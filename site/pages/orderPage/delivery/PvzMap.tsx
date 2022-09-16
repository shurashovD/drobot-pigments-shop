import { useCallback, useEffect, useState } from "react"
import { Toast, ToastContainer } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetDeliveryDetailQuery, useGetPointsQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import ButtonComponent from "../../../components/ButtonComponent"

const reactYandexMaps = require("react-yandex-maps")

const PvzMap = () => {
    const { data: detail } = useGetDeliveryDetailQuery(undefined)
    const [setDetail, { isLoading, isSuccess }] = useSetDeliveryDetailMutation()
    const { data: points } = useGetPointsQuery(undefined)
    const { YMaps, Map, Placemark } = reactYandexMaps
    const [size, setSize] = useState({ width: 200, height: 200 })
    const [checkedPvz, setCheckedPvz] = useState<{code: string, name: string, address: string} | undefined>()
	const dispatch = useAppDispatch()

    const clickHandler = (event: any) => {
		const pvzName = event.originalEvent.target.properties._data.hintContent
		const point = points?.find(({ name }) => name === pvzName)
		if (point && detail?.sdek && detail?.tariff_code) {
            const { name, code, location } = point
			setCheckedPvz({ name, code, address: location.address })
		}
	}

    const container = useCallback((container: HTMLDivElement) => {
        if ( container?.parentElement ) {
            const parent = container.parentElement
			if ( parent.offsetWidth > 0 ) {
				setSize({ width: parent.offsetWidth, height: parent.offsetHeight })
			}
        }
    }, [])

    useEffect(() => {
        if ( isSuccess ) {
            setCheckedPvz(undefined)
			dispatch(setActive("3"))
        }
    }, [dispatch, isSuccess, setActive])

	return (
		<div ref={container} className="position-relative overflow-hidden mw-100">
			<ToastContainer className="position-absolute w-100 bottom-0 px-4" style={{ zIndex: 100 }}>
				<Toast className="w-100 opacity-1" show={!!checkedPvz} onClose={() => setCheckedPvz(undefined)}>
					<Toast.Header className="d-flex justify-content-between align-items-center">{checkedPvz?.name}</Toast.Header>
					<Toast.Body>
						<div className="text-muted mb-3">{checkedPvz?.address}</div>
						{detail && checkedPvz && <ButtonComponent
                            isLoading={isLoading}
                            onClick={() => setDetail({ sdek: true, tariff_code: detail.tariff_code, code: checkedPvz.code })}
                        >Выбрать</ButtonComponent>}
					</Toast.Body>
				</Toast>
			</ToastContainer>
			{points && (
				<YMaps>
					<Map
						state={{
							center: [
								points.reduce((sum, { location }) => sum + location.latitude, 0) / points.length,
								points.reduce((sum, { location }) => sum + location.longitude, 0) / points.length,
							],
							zoom: 11,
							width: size.width,
							height: size.height,
						}}
					>
						{points.map(({ location, code, name }) => (
							<Placemark
								key={code}
								geometry={{
									coordinates: [location.latitude, location.longitude],
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
			)}
		</div>
	)
}

export default PvzMap
