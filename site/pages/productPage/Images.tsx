import { FC, useState } from "react"
import { Button, Carousel, Col, Image, Row } from 'react-bootstrap'

const Images: FC<{ photos: string[] }> = ({ photos }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    return (
		<Row>
			<Col xs={12}>
				<Carousel controls={false} indicators={false} activeIndex={activeIndex} onSelect={(index) => setActiveIndex(index)}>
					{photos.map((item) => (
						<Carousel.Item key={item}>
							<Image src={item} alt="product" fluid />
						</Carousel.Item>
					))}
				</Carousel>
			</Col>
			<Col xs={0} md={12} className="d-none d-md-block">
				<Row xs={4} className="g-3 mt-3">
					{photos.map((item, index) => (
						<Col key={`col_${item}`}>
							<Button className="p-0 border-0" onClick={() => setActiveIndex(index)}>
								<Image src={item} alt="product" fluid />
							</Button>
						</Col>
					))}
				</Row>
			</Col>
		</Row>
	)
}

export default Images