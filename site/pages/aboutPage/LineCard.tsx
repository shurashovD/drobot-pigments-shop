import { FC } from "react"
import { Col, Image, Row } from "react-bootstrap"

interface IProps {
    title: string
    label?: string
    src?: string
}

const LineCard: FC<IProps> = ({ label, title, src }) => {
    return (
		<Row className="line-card m-0">
			<Col xs={9} className="d-flex flex-column justify-content-center align-items-center text-uppercase text-secondary">
				<div className="text-center">{title}</div>
                <div className="text-center text-lowercase">{label}</div>
			</Col>
            <Col xs={3} className="d-flex justify-content-center align-items-center">
                {src && <Image src={src} alt="drobot-pigments-shop" fluid />}
            </Col>
		</Row>
	)
}

export default LineCard