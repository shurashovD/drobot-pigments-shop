import { useEffect, useRef, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import Agent from "./Agent"
import Coach from "./Coach"
import Delegate from "./Delegate"

const Categories = () => {
    const container = useRef<HTMLDivElement | null>(null)
    const [step, setStep] = useState(0)

    useEffect(() => {
		if (container.current) {
			const cols = container.current.getElementsByTagName("div")
			const left = cols[0].offsetWidth * step
			container.current.scrollTo({ left, behavior: "smooth" })
		}
	}, [container, step])

    return (
		<div>
			<div className="text-center fs-3 text-uppercase my-6">Выбери свою категорию</div>
			<Row id="partner-programm-category-container" xs={1} md={3} className="flex-nowrap mb-6 mb-md-0" ref={container}>
				<Col>
					<Agent />
				</Col>
				<Col>
					<Delegate />
				</Col>
				<Col>
					<Coach />
				</Col>
			</Row>
			<div className="text-center d-md-none">
				<Button variant={`outline-${step === 0 ? "dark" : "primary"}`} className="m-0 p-2 px-3" onClick={() => setStep(0)}>
					1
				</Button>
				<Button variant={`outline-${step === 1 ? "dark" : "primary"}`} className="m-0 mx-4 p-2 px-3" onClick={() => setStep(1)}>
					2
				</Button>
				<Button variant={`outline-${step === 2 ? "dark" : "primary"}`} className="m-0 p-2 px-3" onClick={() => setStep(2)}>
					3
				</Button>
			</div>
		</div>
	)
}

export default Categories