import { FC, useState } from "react"
import { Button, Carousel, Image, Modal } from "react-bootstrap"

interface IProps {
    photos: string[]
}

const WorksImagesComponent: FC<IProps> = ({ photos }) => {
    const [show, setShow] = useState(false)

	if ( !photos.length ) {
		return null
	}

    return (
		<div>
			<Modal show={show} fullscreen="lg-down" onHide={() => setShow(false)} size="xl">
				<Modal.Body className="bg-primary">
					<Modal.Header closeButton closeVariant="white" className="border-0" />
					<Carousel>
						{photos.map((item, index) => (
							<Carousel.Item key={`works_photo${item}${index}`}>
								<div style={{ maxHeight: "80vh" }}>
									<img src={item} alt="worksPhoto" style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: 'auto' }} />
								</div>
							</Carousel.Item>
						))}
					</Carousel>
				</Modal.Body>
			</Modal>
			<Button onClick={() => setShow(true)}>Фото работ</Button>
		</div>
	)
}

export default WorksImagesComponent