import { useEffect, useRef, useState } from 'react'
import { Button, Col, Row, Stack } from 'react-bootstrap'
import LineCard from './LineCard'
const lines1 = require("../../../img/lines_1.png")
const lines2 = require("../../../img/lines_2.png")
const lines3 = require("../../../img/lines_3.png")
const lines4 = require("../../../img/lines_4.png")
const lines5 = require("../../../img/lines_5.png")
const lines6 = require("../../../img/lines_6.png")

const PigmentsLines = () => {
	const [state, setState] = useState(0)
	const carousel = useRef<HTMLDivElement | null>(null)
	
	useEffect(() => {
		if ( carousel.current ) {
			const cols = Array.from<HTMLDivElement>(carousel.current.querySelectorAll('div.carousel-cell'))
			if ( cols[0] ) {
				const left = cols[0].offsetWidth * state
				carousel.current.scrollTo({ left, top: 0, behavior: "smooth" })
			}
		}
	}, [carousel, state])

    return (
		<div>
			<div className="fs-3 text-center text-uppercase mb-5">линейки пигментов DROBOT pigments:</div>
			<Row className="d-none d-md-flex g-4 h-100 g-xl-5" md={2} lg={3}>
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
			<Row className="d-md-none flex-nowrap" id="about-line-carousel" ref={carousel}>
				<Col xs={10} className="offset-1 carousel-cell">
					<LineCard title="для век" src={lines1} />
				</Col>
				<Col xs={10} className="carousel-cell">
					<LineCard title="для трихопигментации" src={lines2} />
				</Col>
				<Col xs={10} className="carousel-cell">
					<LineCard title="для губ" src={lines3} />
				</Col>
				<Col xs={10} className="carousel-cell">
					<LineCard title="для бровей" label="органика, минералы, гибриды" src={lines4} />
				</Col>
				<Col xs={10} className="carousel-cell">
					<LineCard title="для камуфляжа рубцов и ареол груди" src={lines5} />
				</Col>
				<Col xs={10} className="carousel-cell">
					<LineCard title="пигментов-корректоров" label="органика, минералы, гибриды" src={lines6} />
				</Col>
				<Col xs={1}></Col>
			</Row>
			<Stack className="text-center d-flex justify-content-center d-md-none" direction="horizontal" gap={3}>
				{[0, 1, 2, 3, 4, 5].map((item) => (
					<div key={`carousel-about_${item}`}>
						<Button
							variant={`outline-${state === item ? "dark" : "gray2"}`}
							style={{ width: `${state === item ? "30" : "25"}px`, height: `${state === item ? "30" : "25"}px` }}
							className="p-0 d-flex justify-content-center align-items-center"
							onClick={() => setState(item)}
						>
							{item + 1}
						</Button>
					</div>
				))}
			</Stack>
		</div>
	)
}

export default PigmentsLines