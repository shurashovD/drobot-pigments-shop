import { FC, useEffect, useState } from "react"
import { Button, Carousel, Image, Modal, ModalProps } from "react-bootstrap"
import { successAlert } from "../../../application/alertSlice"
import { useAppDispatch } from "../../../application/hooks"
import { useRmWorksPhotoMutation } from "../../../application/product.service"

interface IProps extends ModalProps {
	photos: string[]
    productId: string
	startIndex: number
}

const ModalCarousel: FC<IProps> = ({ photos, productId, onHide, show, startIndex }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [rm, { isLoading, isSuccess, reset }] = useRmWorksPhotoMutation()
    const dispatch = useAppDispatch()

    const rmHandler = () => {
        const body = {
            photo: photos[activeIndex]
        }
        rm({ body, id: productId })
    }

    useEffect(() => {
        setActiveIndex(startIndex)
    }, [startIndex])

    useEffect(() => {
        if ( !photos.length && onHide ) {
            onHide()
        }
		setActiveIndex((curr) => Math.min(photos.length - 1, curr))
	}, [photos])

    useEffect(() => {
        if ( isSuccess ) {
            dispatch(successAlert('Фото удалено'))
            reset()
        }
    }, [dispatch, successAlert, isSuccess, reset])

    return (
        <Modal onHide={onHide} show={show}>
            <Modal.Header closeButton />
            <Modal.Body>
                <Carousel activeIndex={activeIndex} onSelect={(index) => setActiveIndex(index)} interval={null}>
                    {
                        photos.map((src, index) => (
                            <Carousel.Item key={`carousel-works-${index}`}>
                                <Image src={src} alt="works" fluid />
                            </Carousel.Item>
                        ))
                    }
                </Carousel>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="link" className="text-danger" onClick={rmHandler} disabled={isLoading}>
                    Удалить фото...
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalCarousel