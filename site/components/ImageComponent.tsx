import { FC, useEffect, useRef, useState } from "react" 
import { Image,  Spinner } from "react-bootstrap"
import { useLazyStaticQuery } from "../application/file.service"

interface IProps {
    widthToHeight?: number
    src: string
}

const ImageComponent: FC<IProps> = ({ widthToHeight = 1, src }) => {
	const [size, setSize] = useState({ width: 0, height: 0 })
    const [trigger, { isFetching, isError, data }] = useLazyStaticQuery()
	const container = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
		const handler = () => {
			if (container.current) {
				const width = container.current.offsetWidth
				const height = width / widthToHeight
				setSize({ width, height })
			}
		}

		if (container.current) {
			const width = container.current.offsetWidth
			const height = width / widthToHeight
			setSize({ width, height })
		}

        const { abort } = trigger(src, true)

		window.addEventListener('resize', handler)

        return () => {
			window.removeEventListener('resize', handler)
            abort()
        }

    }, [trigger, src, container])

	return (
		<div ref={container}>
			<div
				className="bg-light d-flex"
				style={{ width: `${size.width}px`, height: `${size.height}px` }}
			>
				{isFetching && (
					<Spinner
						animation="border"
						variant="secondary"
						className="m-auto"
					/>
				)}
				{!isError && data && (
					<Image
						src={data}
						width={size.width.toString()}
						height={size.height.toString()}
					/>
				)}
			</div>
		</div>
	)
}

export default ImageComponent