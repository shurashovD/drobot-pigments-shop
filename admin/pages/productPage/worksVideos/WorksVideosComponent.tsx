import { FC, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import AddVideoComponent from './AddVideoComponent'
import Item from './Item'
import ModalVideoPlayer from './ModalVideoPlayer'

interface IProps {
    productId: string
    videos: string[]
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
			<div className="fs-5 mb-2">Видео работ</div>
			<Row xs={6} className="g-3">
				{state.map((src) => (
					<Col key={`worksIamge_${src}`}>
						<Item
							itemClickHandler={videoClickHandler}
							src={src}
						/>
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