import { FC, useRef } from "react"
import { Image } from "react-bootstrap"
import { useDrag, useDrop } from 'react-dnd'
import { Identifier } from 'dnd-core'
import classNames from 'classnames'

interface IProps {
    index: number, src: string,
	enable: boolean
    moveHandler(dragIndex: number, hoverIndex: number): void
    setDragging(isDragging: boolean): void
}

const ImageItem: FC<IProps> = ({ enable, index, src, moveHandler, setDragging }) => {
	const ref = useRef<HTMLImageElement | null>(null)

	const [props, drop] = useDrop<IProps, void, { handlerId: Identifier|null }>(() => ({
		accept: "image",
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			}
		},
		hover(item, monitor) {
			if (!ref.current) {
				return
			}

			const dragIndex = item.index
            const hoverIndex = index

            if ( dragIndex === hoverIndex ) {
                return
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
            const clientOffset = monitor.getClientOffset()
            
            if ( !clientOffset ) {
                return
            }

            const hoverClientX = clientOffset.x - hoverBoundingRect.left

            if ( dragIndex > hoverIndex && hoverClientX < hoverMiddleX ) {
                return
            }

            if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
				return
			}

            moveHandler(dragIndex, hoverIndex)
		},
	}))

	const [{ isDragging }, drag] = useDrag(() => ({
		collect(monitor) {
			return {
				isDragging: monitor.isDragging(),
			}
		},
		end() {
			setDragging(true)
		},
		type: "image",
		item: { index, src },
	}))

	drag(drop(ref))

	return <Image fluid src={src} ref={ref} className={classNames({ invisible: isDragging, "opacity-50": !enable })} />
}

export default ImageItem