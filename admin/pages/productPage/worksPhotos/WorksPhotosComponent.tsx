import { FC, useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useWorksPhotosOrderMutation } from '../../../application/product.service'
import AddPhotoComponent from './AddPhotoComponent'
import Item from './Item'
import ModalCarousel from './ModalCarousel'

interface IProps {
    productId: string
    photos: string[]
}

const WorksPhotosComponent: FC<IProps> = ({ productId, photos }) => {
	const [state, setState] = useState<string[]>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [show, setShow] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [sortPhotos, { isLoading }] = useWorksPhotosOrderMutation()

    const imageClickHandler = (index: number) => {
        setActiveIndex(index)
        setShow(true)
    }

	const mover = useCallback((dragIndex: number, hoverIndex: number) => {
		setState((state) => state.map((item, index, arr) => {
			if ( index === dragIndex ) {
				return arr[hoverIndex]
			}
			if ( index === hoverIndex ) {
				return arr[dragIndex]
			}
			return item
		}))
	}, [])

	useEffect(() => {
		setState(photos)
	}, [photos])

	useEffect(() => {
		if ( state.length !== photos.length ) {
			return
		}
		if ( state.some(item => typeof item === "undefined") ) {
			return
		}
		if ( isDragging ) {
			sortPhotos({ body: { photos: state }, id: productId })
			setState([])
			setIsDragging(false)
		}
	}, [isDragging, sortPhotos])

    return (
		<div className="border rounded p-3">
			<ModalCarousel productId={productId} photos={state} show={show} onHide={() => setShow(false)} startIndex={activeIndex} />
			<div className="fs-5 mb-2">Фотографии работ {isLoading && <>...</>}</div>
			<Row xs={6} className="g-3 overflow-scroll flex-nowrap">
				<Col>
					<AddPhotoComponent productId={productId} />
				</Col>
				{state.map((src, index) => (
					<Col key={`worksIamge_${src}`}>
						<Item
							imageClickHandler={imageClickHandler}
							index={index}
							src={src}
							mover={mover}
							setIsDragging={(val: boolean) => setIsDragging(val)}
						/>
					</Col>
				))}
			</Row>
		</div>
	)
}

export default WorksPhotosComponent