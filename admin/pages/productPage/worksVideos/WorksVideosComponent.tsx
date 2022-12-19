import { FC, useEffect, useState } from 'react'
import { Col, ListGroup, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import AddVideoComponent from './AddVideoComponent'
import Item from './Item'
import ModalVideoPlayer from './ModalVideoPlayer'

interface IProps {
    productId: string
    videos: string[]
}

const popover = () => {
	return (
		<Popover id="video-instruction">
			<Popover.Header>Порядок действий</Popover.Header>
			<Popover.Body>
				<ListGroup variant="flush">
					<ListGroup.Item>Загрузить видео</ListGroup.Item>
					<ListGroup.Item>Вкладка "изменение размера разрешения"</ListGroup.Item>
					<ListGroup.Item>Установить разрешение видео 480p</ListGroup.Item>
					<ListGroup.Item>Установить видео fps 25</ListGroup.Item>
					<ListGroup.Item>Нажать кнопку "изменение размера"</ListGroup.Item>
					<ListGroup.Item>Подождать и скачать видео</ListGroup.Item>
				</ListGroup>
			</Popover.Body>
		</Popover>
	)
}

const WorksVideosComponent: FC<IProps> = ({ productId, videos }) => {
	const [state, setState] = useState<string[]>([])
	const [checkedSrc, setCheckedSrc] = useState<string|undefined>()

	const videoClickHandler = (src: string) => {
		setCheckedSrc(src)
	}

	useEffect(() => {
		setState(videos)
	}, [videos])

	return (
		<div className="border rounded p-3">
			<ModalVideoPlayer productId={productId} src={checkedSrc} show={!!checkedSrc} onHide={() => setCheckedSrc(undefined)} />
			<div className="d-flex justify-content-between align-items-center position-relative mb-2">
				<div className="fs-5">Видео работ</div>
				<OverlayTrigger trigger="hover" overlay={popover} placement="top">
					<a href="https://video-cutter-js.com/ru" target="_blank" rel="noopener noreferrer">
						Видео конвертер
					</a>
				</OverlayTrigger>
			</div>
			<Row xs={6} className="g-3">
				{state.map((src) => (
					<Col key={`worksIamge_${src}`}>
						<Item itemClickHandler={videoClickHandler} src={src} />
					</Col>
				))}
				<Col>
					<AddVideoComponent productId={productId} />
				</Col>
			</Row>
		</div>
	)
}

export default WorksVideosComponent