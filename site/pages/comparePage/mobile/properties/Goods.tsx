import { Col, Container, Row } from "react-bootstrap"
import { setLeftIndex, setRightIndex } from "../../../../application/compareSlice"
import { useAppDispatch, useAppSelector } from "../../../../application/hooks"
import Feed from "./Feed"

const Goods = () => {
	const { leftFeedIndex, rightFeedIndex } = useAppSelector(state => state.compareSlice)
	const dispatch = useAppDispatch()

    return (
		<div className="border-bottom border-top border-muted sticky-top bg-light" style={{ zIndex: "1", top: "60px" }}>
			<Container>
				<Row xs={2}>
					<Col className="border-end border-muted py-5">
						<Feed prefix="left" activeIndex={leftFeedIndex} onSelect={(eventKey) => dispatch(setLeftIndex(eventKey))} />
					</Col>
					<Col className="py-5">
						<Feed prefix="right" activeIndex={rightFeedIndex} onSelect={(eventKey) => dispatch(setRightIndex(eventKey))} />
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Goods