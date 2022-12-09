import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Stack } from 'react-bootstrap'
import ImageList from './ImageList'

const ImageSelector = () => {
    return (
		<Stack direction="vertical" gap={2} className="my-3">
			<div className="text-muted">Первое изображение основное</div>
			<div>
				<DndProvider backend={HTML5Backend}>
					<ImageList />
				</DndProvider>
			</div>
			<div className="text-muted">Изображения сортируются перетаскиванием</div>
		</Stack>
	)
}

export default ImageSelector