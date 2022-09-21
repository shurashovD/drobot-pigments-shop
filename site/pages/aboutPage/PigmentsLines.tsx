import { Col, Row } from 'react-bootstrap'
import LineCard from './LineCard'
const lines1 = require("../../img/lines_1.png")
const lines2 = require("../../img/lines_2.png")
const lines3 = require("../../img/lines_3.png")
const lines4 = require("../../img/lines_4.png")
const lines5 = require("../../img/lines_5.png")
const lines6 = require("../../img/lines_6.png")

const PigmentsLines = () => {
    return (
		<>
			<Row className="d-none d-md-flex g-4 h-100" md={2} lg={3}>
				<Col>
					<LineCard title="для век" src={lines1} />
				</Col>
				<Col>
					<LineCard title="для трихопигментации" src={lines2} />
				</Col>
				<Col>
					<LineCard title="для губ" src={lines3} />
				</Col>
				<Col>
					<LineCard title="для бровей" label="органика, минералы, гибриды" src={lines4} />
				</Col>
				<Col>
					<LineCard title="для камуфляжа рубцов и ареол груди" src={lines5} />
				</Col>
				<Col>
					<LineCard title="пигментов-корректоров" label="органика, минералы, гибриды" src={lines6} />
				</Col>
			</Row>
		</>
	)
}

export default PigmentsLines