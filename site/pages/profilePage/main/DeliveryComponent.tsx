import { useEffect, useState } from "react"
import { Col, Row, Spinner } from "react-bootstrap"
import { useGetNearestOrderQuery } from "../../../application/profile.service"
import SlideImgComponent from "../components/SlideImgComponent"

const DeliveryComponent = () => {
    const { data, isFetching } = useGetNearestOrderQuery(undefined)
    const [imgSources, setImgSources] = useState<string[]>([])

    useEffect(() => {
        if ( data ) {
            const arr = data.products.map(({ photo }) => (photo[0]))
            const variantImgs = data.variants.map(({ product, variantId }) => product.variants.find((item) => item._id?.toString() === variantId)?.photo?.[0] || '')
                .filter(item => item !== '')
            arr.concat(variantImgs)
            setImgSources(arr)
        }
    }, [data])

    return (
		<Row>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{!isFetching && data && (
				<Col xs={4} md={2}>
					<SlideImgComponent height={57} imgSources={imgSources} />
				</Col>
			)}
			{!isFetching && data && (
				<Col xs={8} md={10} className="d-flex align-items-center">
					Заказ №{data.number} от {data.date}
				</Col>
			)}
			{!isFetching && data && data.delivery && (
				<Col xs={12} md={2} className="mt-2">
					<span className="text-muted">Ближайшая:</span> {data.delivery}
				</Col>
			)}
			{!isFetching && !data && <div className="text-muted text-center">Ближайших доставок не найдено</div>}
		</Row>
	)
}

export default DeliveryComponent