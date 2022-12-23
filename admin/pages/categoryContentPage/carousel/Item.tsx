import classNames from "classnames"
import { FC, useRef } from "react"
import { Button, Image } from "react-bootstrap"
import { useDrag, useDrop } from "react-dnd"
import { Identifier } from 'dnd-core'

interface IProps {
	imageClickHandler(id: string): void
	id: string
	index: number
	mover(hoverIndex: number, dragIndex: number): void
	setIsDragging: (val: boolean) => void
	src?: string
}

const Item: FC<IProps> = ({ imageClickHandler, id, index, mover, src, setIsDragging }) => {
	const ref = useRef<HTMLButtonElement | null>(null)

	const [{ handlerId }, drop] = useDrop<IProps, void, { handlerId: Identifier | null }>({
		accept: "categorySlide",
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
		type: "categorySlide",
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
			onClick={() => imageClickHandler(id)}
			ref={ref}
			className={classNames({ invisible: isDragging }, "p-0")}
			data-handler-id={handlerId}
		>
			{src ? (
				<Image src={src} alt="carousel-item" fluid />
			) : (
				<>Нет фото</>
			)}
		</Button>
	)
}

export default Item