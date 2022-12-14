import { Stack } from 'react-bootstrap'
import ImageList from './ImageList'

const ImageSelector = () => {
    return (
		<Stack direction="vertical" gap={2} className="my-3">
			<div className="text-muted">Первое изображение основное</div>
			<div>
				<ImageList />
			</div>
			<div className="text-muted">Изображения сортируются перетаскиванием</div>
		</Stack>
	)
}

export default ImageSelector