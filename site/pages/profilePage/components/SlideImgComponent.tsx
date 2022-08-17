import { FC } from "react"
import ImageComponent from "../../../components/ImageComponent"

interface IProps {
    height: number
    imgSources: string[]
}

const SlideImgComponent: FC<IProps> = ({ imgSources, height }) => {
    return (
		<div
			style={{ height: `${height}px` }}
			className="d-flex position-relative overflow-hidden"
		>
			{imgSources.map((src, index) => (
				<div
                    key={`${src}_${index}`}
					className="border border-primary h-100 position-absolute bg-secondary"
					style={{
						width: `${height}px`,
						left: `${0.55 * height * index}px`,
						zIndex: imgSources.length - index,
					}}
				>
                    <ImageComponent src={src} />
                </div>
			))}
		</div>
	)
}

export default SlideImgComponent