import { Col, Row } from "react-bootstrap"
import { useGetProductByIdQuery, useSetPhotoOrderMutation } from '../../../application/product.service'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '../../../application/hooks'
import ImageItem from './ImageItem'

const ImageList = () => {
    const { id } = useParams()
    const [photos, setPhotos] = useState<string[]>([])
    const [dragging, setIsDragging] = useState(false)
    const { checkedVariant } = useAppSelector(state => state.productPageSlice)
    const { data: product, isSuccess } = useGetProductByIdQuery(id || '', { skip: !id })
    const [sort, { isLoading }] = useSetPhotoOrderMutation()

    const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
        setPhotos(state => state.map((item, index, arr) => {
            if ( index === dragIndex ) {
                return arr[hoverIndex]
            }
            if ( index === hoverIndex ) {
                return arr[dragIndex]
            }
            return item
        }))
    }, [photos])

    useEffect(() => {
        if ( (isSuccess || checkedVariant) && product ) {
            const photos = product.variants.find(({ id }) => id === checkedVariant)?.photo || product.photo
            setPhotos(photos)
        }
    }, [checkedVariant, isSuccess, product])

    useEffect(() => {
        const productPhotos = product?.variants.find(({ id }) => id === checkedVariant)?.photo || product?.photo
		if (photos.length !== productPhotos?.length) {
            setIsDragging(false)
			return
		}

		if (photos.some((item) => !item)) {
            setIsDragging(false)
			return
		}

		if (dragging && id && photos.length) {
			setIsDragging(false)
			sort({ body: { photo: photos, variantId: checkedVariant }, productId: id })
			setPhotos([])
		}
	}, [checkedVariant, dragging, id, product, photos, sort])

    return (
		<Row xs={2} md={3} className="g-3 overflow-scroll flex-nowrap">
			{photos.map((item, index) => (
                <Col key={item}>
                    <ImageItem
                        index={index}
                        src={item}
                        moveHandler={moveImage}
                        setDragging={(isDragging: boolean) => setIsDragging(isDragging)}
                        enable={!isLoading}
                    />
                </Col>
            ))}
		</Row>
	)
}

export default ImageList