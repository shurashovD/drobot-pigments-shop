import { FC, useCallback, useEffect, useRef, useState } from "react" 
import { Fade, Image, Ratio, Spinner } from "react-bootstrap"
import { useLazyStaticQuery } from "../application/file.service"

interface IProps {
    widthToHeight?: number
    src: string
}

const ImageComponent: FC<IProps> = ({ widthToHeight = 1, src }) => {
	const [size, setSize] = useState({ width: 0, height: 0 })
    const [trigger, { isFetching, isError, data }] = useLazyStaticQuery()

    const container = useCallback((container: HTMLDivElement) => {
		if (container) {
			const width = container.offsetWidth
			const height = width / widthToHeight
			setSize({ width, height })
		}
	}, [])

    useEffect(() => {
        const { abort } = trigger(src, true)

        return () => {
            abort()
        }

    }, [trigger])

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