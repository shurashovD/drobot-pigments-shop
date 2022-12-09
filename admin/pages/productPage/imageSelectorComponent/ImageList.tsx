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
        const leftIndex = Math.min(dragIndex, hoverIndex)
        const rightIndex = Math.max(dragIndex, hoverIndex)
        setPhotos(state => [...state.slice(0, leftIndex), state[rightIndex], state[leftIndex], ...state.slice(rightIndex + 1)])
    }, [])

    useEffect(() => {
        if ( (isSuccess || checkedVariant) && product ) {
            const photos = product.variants.find(({ id }) => id === checkedVariant)?.photo || product.photo
            setPhotos(photos)
        }
    }, [checkedVariant, isSuccess, product])

    useEffect(() => {
		if (dragging && id && photos.length) {
			console.log(photos)
            setIsDragging(false)
			sort({ body: { photo: photos, variantId: checkedVariant }, productId: id })
		}
	}, [dragging, id, photos, sort])

    return (
		<Row xs={2} md={3}>
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