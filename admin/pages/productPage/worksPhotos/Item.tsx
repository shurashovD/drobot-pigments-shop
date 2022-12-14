import classNames from "classnames"
import { FC, useEffect, useRef } from "react"
import { Button, Image } from "react-bootstrap"
import { useDrag, useDrop } from "react-dnd"
import { Identifier } from 'dnd-core'

interface IProps {
	imageClickHandler(index: number): void
	index: number
	mover(hoverIndex: number, dragIndex: number): void
	setIsDragging: (val: boolean) => void
	src: string
}

const Item: FC<IProps> = ({ imageClickHandler, index, mover, src, setIsDragging }) => {
	const ref = useRef<HTMLButtonElement | null>(null)

	const [{ handlerId }, drop] = useDrop<IProps, void, { handlerId: Identifier | null }>({
		accept: "worksImage",
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

			if (dragIndex === hoverIndex) {
				return
			}

			const hoverBoundingRect = ref.current?.getBoundingClientRect()
			const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
			const clientOffset = monitor.getClientOffset()

			if (!clientOffset) {
				return
			}

			const hoverClientX = clientOffset.x - hoverBoundingRect.left

			if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
				return
			}

			if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
				return
			}
			mover(dragIndex, hoverIndex)
			item.index = hoverIndex
		},
	})

	const [{ isDragging }, drag] = useDrag(() => ({
		type: "worksImage",
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		end: () => {
			setIsDragging(true)
		},
		item: { index, src },
	}))

	drag(drop(ref))

	return (
		<Button
			onClick={() => imageClickHandler(index)}
			ref={ref}
			className={classNames({ invisible: isDragging }, "p-0")}
			data-handler-id={handlerId}
		>
			<Image src={src} alt="works" fluid />
		</Button>
	)
}

export default Item