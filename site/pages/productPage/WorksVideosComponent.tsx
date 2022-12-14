import { FC, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import ReactPlayer from "react-player"

const WorksVideosComponent: FC<{ videos: string[] }> = ({ videos }) => {
    const [show, setShow] = useState(false)
    const [index, setIndex] = useState(0)

    const prevHandler = () => {
        setIndex(state => state === 0 ? videos.length - 1 : state - 1)
    }

    const nextHandler = () => {
		setIndex(state => state === videos.length - 1 ? 0 : state + 1)
	}

    if ( !videos.length ) {
        return null
    }

    return (
		<div>
			<Modal show={show} fullscreen="lg-down" onHide={() => setShow(false)} size="xl">
				<Modal.Body className="bg-primary">
					<Modal.Header closeButton closeVariant="white" className="border-0 text-secondary" />
					<div style={{ maxHeight: "80vh" }}>
						<ReactPlayer url={videos[index]} controls width="100%" height="auto" />
					</div>
					<div className="d-flex justify-content-between align-items-center mt-3">
						<Button onClick={prevHandler} variant="link" className="text-secondary">Пред.</Button>
						<Button onClick={nextHandler} variant="link" className="text-secondary">След.</Button>
					</div>
				</Modal.Body>
			</Modal>
			<Button onClick={() => setShow(true)}>Видео работ</Button>
		</div>
	)
}

export default WorksVideosComponent