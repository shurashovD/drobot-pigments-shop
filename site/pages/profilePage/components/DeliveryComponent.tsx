import { Col, Row, Spinner } from "react-bootstrap"
import { useGetNearestOrderQuery } from "../../../application/profile.service"
import SlideImgComponent from "./SlideImgComponent"

const DeliveryComponent = () => {
    const { data, isFetching } = useGetNearestOrderQuery(undefined)

    return (
		<Row>
            { isFetching && <div className="text-center p-3">
                <Spinner variant="secondary" animation="border" />
            </div> }
			{data && <Col xs={4} md={2}>
                <SlideImgComponent height={57} imgSources={Array(2).fill('')} />
            </Col>}
			{data && <Col xs={8} md={10} className="d-flex align-items-center">
				Заказ №{data.number} от {data.date}
			</Col>}
			{data && data.delivery && <Col xs={12} md={2} className="mt-2">
				<span className="text-muted">Ближайшая:</span> {data.delivery}
			</Col>}
            { !isFetching && !data && <div className="text-muted text-center">
                Ближайших доставок не найдено
            </div> }
		</Row>
	)
}

export default DeliveryComponent